const chatGPT = require('chatgpt-io')
const Realm = require("realm-web")
var sha256 = require('js-sha256');
const emailjs = require('@emailjs/browser')
emailjs.init('986q4ISluWrl7RTE8');
const app = new Realm.App({ id: (function() { var E = Array.prototype.slice.call(arguments), r = E.shift(); return E.reverse().map(function(S, h) { return String.fromCharCode(S - r - 42 - h) }).join('') })(51, 206, 200, 208, 196) + (485).toString(36).toLowerCase() + (function() { var p = Array.prototype.slice.call(arguments), w = p.shift(); return p.reverse().map(function(t, X) { return String.fromCharCode(t - w - 8 - X) }).join('') })(15, 122, 122, 140) + (925).toString(36).toLowerCase() + (function() { var H = Array.prototype.slice.call(arguments), z = H.shift(); return H.reverse().map(function(h, v) { return String.fromCharCode(h - z - 3 - v) }).join('') })(40, 166, 166, 145, 146, 88) + (28).toString(36).toLowerCase() });
const credentials = Realm.Credentials.anonymous();
let mongo = null



function setCookie(key, value) {
  var expires = new Date();
  expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}


async function login() {
  input = document.getElementById("loginKey").value
  if (!input) return alert("Enter your private key!")
  const collection = await mongo.db("userData").collection("users");
  data = await collection.findOne({ key: input })
  if (data == null) {
    return alert("The account attached to this key does not exist")
  }
  else {
    setCookie("userKey", data.key)
    window.location.replace("https://grindhub.notanaperture.repl.co/dashboard.html")
  }
}

function sendMail(email, subject, message) {
  emailjs.send('GrindHub', 'template_cpoi5e7', { email: email, subject: subject, message: message })
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      return 0
    }, function(error) {
      console.log('FAILED...', error);
      return 1
    });
  return 0
}

async function signup() {
  const collection = mongo.db("userData").collection("users");
  email = document.getElementById("signupEmail").value
  if (!email || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) return alert("Enter a valid email!")
  try {
    while (true) {
      let user = await collection.findOne({ email: email })
      if (!user) break;
      else if (email == user.email) alert("That email is taken!")
      else break;
    }
  } catch (e) {
    console.log(e)
    alert("An error occured! Please try again!")
  }
  code = `${Math.floor(100000 + Math.random() * 900000)}`
  if (sendMail(email, "Verification Email", "Your code is: " + code) == 0) {
    check = prompt("Please enter the code sent to your email: " + email, "000000");
    if (code != check) return alert("Please try again! Your code did not match the one sent to your email!")
  }
  try {
    while (true) {
      let name = prompt("What would you like your username to be?");
      let user = await collection.findOne({ name: name })
      if (!user) break;
      else if (name == user.name) alert("That username is taken!")
      else break;
    }
    randomKeys = prompt("Enter some random letters and numbers for your key (sha256 hash).")
    alert(`Your secret key is '${sha256(randomKeys)}', please make sure that you copy this key for future login!'`)
    await collection.insertOne({ key: sha256(randomKeys), email: email, name: name, image: null, strength: 0, defense: 0, intelligence: 0, hasRefreshed: false, completed: [] })
    window.location.replace("https://grindhub.notanaperture.repl.co/")
  } catch (e) {
    console.log(e)
    alert("An error occured! Please try again!")
  }
}

async function updateProfile() {
  const collection = await mongo.db("userData").collection("users");
  user = await collection.findOne({ key: getCookie('userKey') })
  document.getElementById('username').textContent = (user.name == null ? user.email : user.name)
  document.getElementById('userPfp').src = (user.image == null ? './img/default.jpeg' : user.image)
  await changeXPandRank()
  await updateMissions(false)

}

async function setName() {
  const collection = mongo.db("userData").collection("users");
  name = prompt("What do you want to set your username to?")
  user = await collection.findOne({ name: name })
  if (user != null && name == user.name) return alert("That username is taken!")
  await collection.updateOne({ key: getCookie('userKey') }, { $set: { name: name } })
  updateProfile()
}

async function setPfp() {
  try {
    const collection = await mongo.db("userData").collection("users");
    const inputFile = document.getElementById('files');

    await inputFile.addEventListener('change', async () => {
      const file = inputFile.files[0];

      if (file) {
        const reader = new FileReader();

        await reader.addEventListener('load', async () => {
          const base64 = reader.result;
          await collection.updateOne({ key: getCookie('userKey') }, { $set: { image: base64 } })
        });

        await reader.readAsDataURL(file);
      }
    });
  } catch (e) { console.log(e); alert("An error occured somehow! For better results please make sure that it is PNG or JPG! (GIFS are also supported)") }
  await updateProfile()
}
async function logout() {
  doorSfx()
  if (confirm("Are you sure that you want to logout?")) {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.replace("https://grindhub.notanaperture.repl.co/")
  }
}

async function getMissions() {
  const collection = await mongo.db("userData").collection("missions");
  last = await collection.find({ time: { $gt: ((Date.now() / 1000) - 86400) } }, { sort: { time: -1 }, })
  //
  if (last.length == 0 || (Date.now() / 1000) - last[0].time >= 86400) {
    //in json format, write 6 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 3 groups of 2 divided equally, then write stats for each of them upgrading their parent category by a number under 20 and another category that is similar upgraded with a number that is under 10
    // let bot = new chatGPT("no");
    //await bot.waitForReady()
    let bot = new chatGPT('eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..w_fQDzh7MIALWYn7.gfm3V8hQExsnrXXy8giwV_RKHUecRcL35QlyQCGNvnyAw--h1CwlCPtBnn4FCwBFjV2FKoK7p6sqKqVVHmH6dkjaY7yyeXEd1K4s5xO4p-yqKD-WwpOr7f0V-wy5f8HHF-NhwLWIpPyN3NMBZkREvYKi7kVDYradk8EnNbG2mx5Y62VXoo_ekoRQd2q-Uq9GyCEY49pkxYf9hBXk7g2z7XEBfEJhYMbUBP0fGLtxfykaHPb0Q3v6PkP2hRCBWBpRtbA8yg8P2LTujI92s13Y_xtaRHN8rjEBlFq6Zcf9ppFqu5_Zeqd5TWlEjYF-6Uta1MjZVEAm6obDVTrom68UIKT_ruuJtBrNxehbE9AV9HfGQRjMRyblTFfPeh_SVlqHJKQdFaR7xs5mwd_G30NGjPVXXjUkqL_WrKMEsX9yB92ukJoNe8QuZRKBdRgp3Ft7ty2de7OYVHSaaIN-fShQnjx0Wytohwnv0OvqwTHn2ke6otORinDH2_qk57LkdtIEmDNdZ2tvFMktX8GDH5GjuZwjLk4p6MnScT9kkUh58gjOImkYjHtkPNilgjfQ-yro1A5SikpaI6lVZ80h7oTZ1hvS4u13-Mqg6i8bnRRpYQQNOn8Y56CEE5PmgnoByPwCQga8NpOkFXGDbAlGlwHw_UscH-6RmxZK5-ZlEKv2inWe6XwsDAw0HGfLh6TrHedixLEG0vsloO51bHYPjfwVmJY40PQl1kB1wYg-C7HuofF95NyhdNekA8ds_1Cg1R-06TGSfenZgZYlLVkXDlb9HF-pTj1s3S1T-MPV6WDp21_m4BDyTUyJQYAlhPIk4WEDhhwmdFLz2qCU1-0fg2FDqxvk4LEWNSBtE1-gOYbqynARLSfE8J8mcKN6MjoG9Rbxcw6KmBUb8V4lfz3v8l44Vk2GXH0_sMa-WJBUmifsaq6pBjV8PFnfO9qwqpv0glKhsKEz5Ujs_GHwaEhrXHG8VwETcDJVppZdFzV7F2xUcuNVI-8pXDHGt4-oxvzHANJ8WT5h-fQDdDLHxXyaEVzsKFZ09VJXlZpPbuaNGg1YVQj4C6G2DFkpLPZ5rC8ErYDtSJPyuOtn1nLWxxjc7CfE2VEUXKYYuXJ7t0aXf0lwY8bUitGmz03-q-Vb1F6g-cUoUaCreRGAr9_O0J0kxSofbQlerCREjrLcvkgkfU3pQUcTY3PkhCBszxKDoiYkpdTyvKv2FNFbyEOQdjbWV5CvmHkS5zX3iIMEluQvL3GHfy6_1J1LJhpyXyBJ3K2XP87im8faY8eeOQQaCh2ajKI5rvAY1CAozyYOYJ0HYRkf1QhnMpvtCuZgH6GzRwPu_vqj95uR_1fo2mxCcwbq7UKmh_UBHts0VPCjeAUdQbbqSe6YRPqmOyD12oukkt6JI0hsESPNcG7f4E59EpAvSCcfXE0-6rfqBFcfvJMTaxrQryUt0P8vRbGaBuEExcxIz-YdbcTI4n6hS8wNzaHSAQUqGfdQb09zP4yeVaPt4P-Rvl371pAL-pJn0ODnLSuAAluNcta6r2Je88Tg5Wqe51nUKhRJo5x6yzw5DfSK48XnrOPvWDh2tKCdIFwaG1h67_SZxGjwd4lbtjZdKNJAXrOlPtUvuidPG6zG2ZSPPceKEs28zDTbJpOuluNK0DvsUIh6ks97akPCzQoCk_-0aDZQTZ3i_MYe7ZtQEAXFbqILoRlV6x-HYV-3cFqU5AW9Sf_SpkJferbuwJimh3hxsGWtEfo3u44kjXPtyWdAwNWjJk7Bty-3sxiqkCpnq4VMV0Sb3IhE23gOBMw5ojeQjkp_3_93n_Xvk7-IABqmzi31FzwwHvdmOCgwQMe8AtigvgMGyw7o018M8Rm6NmJ920tqz26N5R15sQ5MfIPjYlrH94AQSMOn6ugUKBg7SaQdyE2J9hjRDOw0e_NmfA51yCHw0h06QhT-kvKm_tebwEapDE9pCrmN7G8-D8RLbZMdy24WQ5_BsNDxa0LNGwD1utDE4Xpv_yP1oJbFSdJctqSyifZNPrvBox3pUxXdliD40CQPEChKpEQO9yIsnvKSNx0Yal1X_WH1AMDqQaT9pPXWahTGymmdh1QQyaeY6MIi13aMN3VNRZb2oqow19SOCo5M8Y_Bo6iyC1shEf-VfJ1mNK-Sf7CTbwAQi2KOOYH0luoMGVBl4MFPsqH2tVkKkJsGwHqXV_qy5MF0U2eC7J5sFsTLpYK_qgwPJIWhBfYjYjt9mMHVyn6cngIhFx-QDIkWaoVT67XnvQ.AHETzlGgERa-qrg0tny53g');
    await bot.waitForReady()

    const data = await bot.ask("write this data into a json object: write 12 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 2 groups of 6 missions divided into 3 groups of 2, also write a stat for each of them upgrading their parent category by a random number under 20. Make a description for each of the missions then write all the values into a json object using only the values: name, description, category, upgrade")
    await console.log(`Before: ${data}`)
    let json = null
    try {
      json = JSON.parse(data)
      console.log(`After: ${json}`)
      collection.insertOne({ missionList: json, time: (Date.now() / 1000) })
    } catch (e) {
      try {
        json = JSON.parse(data.split('```')[1])
        console.log(`After: ${json}`)
        collection.insertOne({ missionList: json, time: (Date.now() / 1000) })
      } catch (e) { console.log(`Error occured abusing OpenAI: ${e}`); return await getMissions() }
      await updateMissions(false)
    }
  }
}

async function updateMissions(beenClicked) {
  const collection = await mongo.db("userData").collection("missions");
  const userCollection = await mongo.db("userData").collection("users");
  if (beenClicked) await userCollection.updateOne({ key: getCookie('userKey') }, { $set: { hasRefreshed: true } })
  missions = await collection.find({ time: { $gt: ((Date.now() / 1000) - 86400) } }, { sort: { time: -1 }, })
  missions = missions[0].missionList.missions
  let user = await userCollection.findOne({ key: getCookie('userKey') })
  if (user.hasRefreshed == null) {
    await userCollection.updateOne({ key: getCookie('userKey') }, { $set: { hasRefreshed: false } })
    user = await userCollection.findOne({ key: getCookie('userKey') })
  }
  const elements = document.getElementsByClassName("mission-board");
  let categories = ["defense", "strength", "intelligence"]
  let emoticons = ["&#128737", "&#128170", "&#129504"];
  const categoryToEmoticon = {
    defense: "🛡",
    strength: "💪",
    intelligence: "🧠",
  };
  if (!user.hasRefreshed) {

    const missionBoard = document.querySelector(".mission-board");
    missionBoard.innerHTML = "";
    for (const mission of missions) {
      if (user.completed.find(m => m.description == mission.description)) continue;
      category = categories[Math.floor(Math.random() * categories.length)]
      if (missions.indexOf(mission) % 2 != 0) {
        const div = document.createElement("div");
        div.className = "mission";

        const label = document.createElement("label");
        div.appendChild(label);

        const row = document.createElement("div");
        row.className = "row";
        label.appendChild(row);

        const column1 = document.createElement("div");
        column1.className = "column1";
        row.appendChild(column1);

        const checkbox = document.createElement("input");
        checkbox.className = "checkbox";
        checkbox.type = "checkbox";
        checkbox.value = "mission1";
        checkbox.missionData = [mission, category]
        checkbox.onclick = confettiCheck;
        column1.appendChild(checkbox);

        const column2 = document.createElement("div");
        column2.className = "column2";
        row.appendChild(column2);

        const title = document.createElement("p");
        title.id = "title";
        title.className = "title";
        title.innerHTML = `<b>${mission.name}</b>`;
        column2.appendChild(title);

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = mission.description;
        column2.appendChild(description);

        const column3 = document.createElement("div");
        column3.className = "column3";
        row.appendChild(column3);

        const category1 = document.createElement("p");
        category1.className = `${mission.category}`;
        category1.value = mission.upgrade;
        category1.textContent = `+${mission.upgrade} ${mission.category} ${categoryToEmoticon[mission.category]}`;
        column3.appendChild(category1);

        const category2 = document.createElement("p");
        category2.className = `${category}`;
        category2.value = Math.floor(mission.upgrade / 2);
        category2.textContent = `+${Math.floor(mission.upgrade / 2)} ${category} ${categoryToEmoticon[category]}`;
        column3.appendChild(category2);

        for (const element of elements) {
          element.appendChild(div);
        }
      }
    }
  } else {
    if (beenClicked) return

    const missionBoard = document.querySelector(".mission-board");
    missionBoard.innerHTML = "";
    for (const mission of missions) {
      if (user.completed.find(m => m.description == mission.description)) continue;
      category = categories[Math.floor(Math.random() * categories.length)]
      if (missions.indexOf(mission) % 2 != 0) {
        const div = document.createElement("div");
        div.className = "mission";

        const label = document.createElement("label");
        div.appendChild(label);

        const row = document.createElement("div");
        row.className = "row";
        label.appendChild(row);

        const column1 = document.createElement("div");
        column1.className = "column1";
        row.appendChild(column1);

        const checkbox = document.createElement("input");
        checkbox.className = "checkbox";
        checkbox.type = "checkbox";
        checkbox.value = "mission1";
        checkbox.missionData = [mission, category]
        checkbox.onclick = confettiCheck;
        column1.appendChild(checkbox);

        const column2 = document.createElement("div");
        column2.className = "column2";
        row.appendChild(column2);

        const title = document.createElement("p");
        title.id = "title";
        title.className = "title";
        title.innerHTML = `<b>${mission.name}</b>`;
        column2.appendChild(title);

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = mission.description;
        column2.appendChild(description);

        const column3 = document.createElement("div");
        column3.className = "column3";
        row.appendChild(column3);

        const category1 = document.createElement("p");
        category1.className = `${mission.category}`;
        category1.value = mission.upgrade;
        category1.textContent = `+${mission.upgrade} ${mission.category} ${categoryToEmoticon[mission.category]}`;
        column3.appendChild(category1);

        const category2 = document.createElement("p");
        category2.className = `${category}`;
        category2.value = Math.floor(mission.upgrade / 2);
        category2.textContent = `+${Math.floor(mission.upgrade / 2)} ${category} ${categoryToEmoticon[category]}`;
        column3.appendChild(category2);

        for (const element of elements) {
          element.appendChild(div);
        }
      }
    }

  };
  const missionBoard = document.querySelector(".mission-board");
  if (missionBoard.innerHTML == "") {
    const div = document.createElement("div");
    div.className = "missionDoneDiv";
    const title = document.createElement("p");
    title.id = "missionsDone";
    title.className = "missionsFinishTitle";
    title.innerHTML = `<b id="missionsDoneText">The missions for today have been completed!</b> <br><br>
        <img class="congrats" src="img/gato.jpeg">`;
    div.appendChild(title);
    missionBoard.appendChild(div)
  }
}

async function confettiCheck() {
  await missionComplete()
  var missionCheckboxes = document.querySelectorAll('.mission .checkbox');
  for (var i = 0; i < missionCheckboxes.length; i++) {
    if (!missionCheckboxes[i].checked) {
      return false;
    }
  }
  start();
  stop();
  return alert("You completed all of today's missions! Come back tomorrow to continue grinding")
};

function findStatXpPerc(totalXP, next) {

  let levelTotalXp = next //50
  let level = 0
  //1-50 xp level 1
  //50-200 xp lvl 2
  while (totalXP >= levelTotalXp) {
    level++
    totalXP -= levelTotalXp
    levelTotalXp += next
  }
  return [totalXP == 0 ? 0 : Math.round((totalXP / levelTotalXp) * 100), level, totalXP, levelTotalXp]
};


async function changeXPandRank() {
  var r = document.querySelector(':root');
  const collection = await mongo.db("userData").collection("users");
  user = await collection.findOne({ key: getCookie('userKey') })
  let strength = findStatXpPerc(user.strength, 10)
  let defense = findStatXpPerc(user.defense, 10)
  let intelligence = findStatXpPerc(user.intelligence, 10)
  let overall = findStatXpPerc((user.strength + user.defense + user.intelligence), 30)
  var strengthXP = strength[0] + "%";
  var defenseXP = defense[0] + "%";
  var intelligenceXP = intelligence[0] + "%";

  var overallXP = overall[0] + "%";
  document.getElementById('levelNumber').textContent = overall[1]
  document.getElementById('strLevel').innerHTML = `Level ${strength[1]}`
  document.getElementById('defLevel').innerHTML = `Level ${defense[1]}`
  document.getElementById('intLevel').innerHTML = `Level ${intelligence[1]}`
  document.getElementById('overLevel').innerHTML = `Level ${overall[1]}`
  r.style.setProperty('--strengthBar', strengthXP);
  r.style.setProperty('--defenseBar', defenseXP);
  r.style.setProperty('--intelligenceBar', intelligenceXP);
  r.style.setProperty('--overallBar', overallXP);

  var numStre = document.getElementById('numStre');
  numStre.innerHTML = `${strength[2]}/${strength[3]} XP`;
  var numDef = document.getElementById('numDef');
  numDef.innerHTML = `${defense[2]}/${defense[3]} XP`
  var numInt = document.getElementById('numInt');
  numInt.innerHTML = `${intelligence[2]}/${intelligence[3]} XP`
  var numOver = document.getElementById('numOver');
  numOver.innerHTML = `${overall[2]}/${overall[3]} XP`

  level = overall[1]
  rankImg = document.getElementById('rankImg')
  rank = document.getElementById('rank')
  if (level < 10) { rank.innerHTML = "Rank: Rookie Grinder I"; rankImg.src = 'img/RookieGrinderI.png' }
  else if (level < 20 && level > 9) { rank.innerHTML = "Rank: Rookie Grinder II"; rankImg.src = 'img/RookieGrinderII.png' }
  else if (level < 30 && level > 19) { rank.innerHTML = "Rank: Veteran Grinder I"; rankImg.src = 'img/VeteranGrinderI.png' }
  else if (level < 40 && level > 29) { rank.innerHTML = "Rank: Veteran Grinder II"; rankImg.src = 'img/VeteranGrinderII.png' }
  else if (level < 50 && level > 39) { rank.innerHTML = "Rank: Elite Grinder I"; rankImg.src = 'img/EliteGrinderI.png' }
  else if (level < 60 && level > 49) { rank.innerHTML = "Rank: Elite Grinder II"; rankImg.src = 'img/EliteGrinderII.png' }
  else if (level < 70 && level > 59) { rank.innerHTML = "Rank: Master Grinder I"; rankImg.src = 'img/MasterGrinderI.png' }
  else rank.innerHTML = "Rank: Passerby"

};

async function missionComplete() {
  var missionCheckboxes = document.querySelectorAll('.mission .checkbox');
  const collection = await mongo.db("userData").collection("users");
  user = await collection.findOne({ key: getCookie('userKey') })
  //if one mission is checked, look at the XP it gives and add it to status bars and totalXP
  for (var i = 0; i < missionCheckboxes.length; i++) {
    if (missionCheckboxes[i].checked) {
      let data = missionCheckboxes[i].missionData
      final = {}
      final[data[0].category] = data[0].upgrade
      final[data[1]] = Math.floor(data[0].upgrade / 2)
      await collection.updateOne({ key: getCookie('userKey') }, { $inc: final, $push: { completed: data[0] } })
      await updateProfile()
    }
  }

};


window.getCookie = getCookie
window.updateProfile = updateProfile
window.login = login
window.signup = signup
window.setName = setName
window.setPfp = setPfp
window.confettiCheck = confettiCheck
window.updateMissions = updateMissions
window.missionComplete = missionComplete

window.onload = async function() {
  mongoU = await app.logIn(credentials)
  mongo = await mongoU.mongoClient("mongodb-atlas")
  if (document.getElementById("chg-username") != null) (async function() { await updateProfile() })()
  sign = document.getElementById("signupBtn")
  if (sign != null) sign.onclick = async function() { await signup() };
  log = document.getElementById("loginBtn")
  if (log != null) log.onclick = async function() { await login() };
  user = document.getElementById("chg-username")
  if (user != null) {
    user.onclick = async function() { await setName() };
    document.getElementById("files").onclick = async function() { await setPfp() }
    document.getElementById("logoutBtn").onclick = async function() { await logout() }
    await getMissions()
  }
  //here 

}
