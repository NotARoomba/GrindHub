const superagent = require('superagent')
const BACKEND_URL = "https://grindhub-api.notaroomba.xyz"



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
  console.log("LOGIN")
   //let data = await superagent.post(BACKEND_URL + "/user").send({ key: input }).then((res) => {
  //  console.log(res.data.json())
  //})
  let data = fetch(BACKEND_URL + "/user", {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: input })
  })
  console.log(data)
  if (data == null) {
    return alert("The account attached to this key does not exist")
  }
  else {
    setCookie("userKey", data.key)
    window.location.href("dashboard.html")
  }
}

async function signup() {
  email = document.getElementById("signupEmail").value
  if (!email || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) return alert("Enter a valid email!")
  try {
    while (true) {
      let user = await superagent.post(BACKEND_URL + "/user").send({ email: email }).data.json()
      if (!user) break;
      else if (email == user.email) alert("That email is taken!")
      else break;
    }
  } catch (e) {
    console.log(e)
    alert("An error occured! Please try again!")
  }
  code = `${Math.floor(100000 + Math.random() * 900000)}`
  if (await superagent.post(BACKEND_URL + "/email").send({email: email, subject: "Verification Email", message: ("Your code is: " + code)}) == 0) {
    check = prompt("Please enter the code sent to your email: " + email, "000000");
    if (code != check) return alert("Please try again! Your code did not match the one sent to your email!")
  }
  try {
    while (true) {
      let name = prompt("What would you like your username to be?");
      let user = await superagent.post(BACKEND_URL + "/user").send({ name: name }).data.json()
      if (!user) break;
      else if (name == user.name) alert("That username is taken!")
      else break;
    }
    //set user data
    randomKeys = prompt("Enter some random letters and numbers for your key (sha256 hash).")
    alert(`Your secret key is '${sha256(randomKeys)}', please make sure that you copy this key for future login!'`)
    //add a user
    await superagent.post(BACKEND_URL + "/signup").send({ key: sha256(randomKeys), email: email, name: name, image: null, strength: 0, defense: 0, intelligence: 0, hasRefreshed: false, completed: [] }).data.json()
    window.location.href("index.html")
  } catch (e) {
    console.log(e)
    alert("An error occured! Please try again!")
  }
}

async function updateProfile() {
  let user = await superagent.post(BACKEND_URL + "/user").send({ key: getCookie('userKey') }).data.json()
  document.getElementById('username').textContent = (user.name == null ? user.email : user.name)
  document.getElementById('userPfp').src = (user.image == null ? './img/default.jpeg' : user.image)
  await changeXPandRank()
  await updateMissions(false)

}

async function setName() {
  let name = prompt("What do you want to set your username to?")
  let user = await superagent.post(BACKEND_URL + "/user").send({ name: name }).data.json()
  if (user != null && name == user.name) return alert("That username is taken!")
  await superagent.post(BACKEND_URL + "/userupdate").send(({ key: getCookie('userKey') }, { $set: { name: name } })).data.json()
  await collection.updateOne()
  updateProfile()
}

async function setPfp() {
  try {
    const inputFile = document.getElementById('files');

    await inputFile.addEventListener('change', async () => {
      const file = inputFile.files[0];

      if (file) {
        const reader = new FileReader();

        await reader.addEventListener('load', async () => {
          const base64 = reader.result;
          //set user data
          await superagent.post(BACKEND_URL + "/userupdate").send(({ key: getCookie('userKey') }, { $set: { image: base64 } }))
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
    window.location.href("index.html")
  }
}

async function getMissions() {
  //get mission
  let last = await superagent.post(BACKEND_URL + "/missions").send(({ time: { $gt: ((Date.now() / 1000) - 86400) } }, { sort: { time: -1 }, })).data.json()
  //
  if (last.length == 0 || (Date.now() / 1000) - last[0].time >= 86400) {
    //in json format, write 6 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 3 groups of 2 divided equally, then write stats for each of them upgrading their parent category by a number under 20 and another category that is similar upgraded with a number that is under 10
    // let bot = new chatGPT("no");
    //await bot.waitForReady()
    let bot = new chatGPT('eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..wwBWtFYZ0a2rqT46.UjF5d9rx-UoJ_tyKesVwBlWTSSKXn-XQX-fmDmFqjyu6DrHqmME4Zui68U8VwGMzqPa-Juj02kpTXZAQe9VL_LzDpY_FyUZSLPupAPp8jJhDweo1I4W-m0kMrPbqCNXxKYHENh1D5c36jGJAyXdUILRsevFQy1yyQjG3Xmu7GPiUt71C6GFGzNXveqzhU6HTnyphdseVraQwWt-iE4PF2sImh5HO5DudCWHqgummKHnPgEvv6RMGYP811QF7WaZ73IQKdS-n1sgTHCL1x88wbRI4OY_xfj5aCK-F3T454Pz4C-JkJCYe_H5KNVFgMxigyFd-nhEA0It6XPoYnsvVz5BzxuG5hq00aYEwMcZyZBa3a-2TQcHQY2fiLTwFonKUvuuzU0TVwpqNS68QNbDqF4i9dX3NqokCtNl6x_ZQB06O_le_aF498GfvHz8mPabZ2yUuTTc6N84UXuq0X_ofaj88UblRJ0kH2Cv0WTobTEd8lBKRKEFcn7D_JMx86V5hFywZ8JUCeNA9SExe-l1KwebSYh456dWBM1vONiOxnaV2PiO2eQB2UkwJjKAGASTOilr2CttmwC0_no3UuBnb-palJdLxNcRB-dU9-w22MYReHj4S6dwMezpCB30JyDXpRR_QIDXvLnSCxth35-GgR5ee6n9cvX13sXTokMmF19_Bd1ORAHHv1BJydH8WSqas5cK66kYPPInl1tg7-tTxAaKprUY1vZ-VpbEilTA7wnK7QW2-C-UEY_SqchdzcwHkxrJC2cg3LbsgMNyr1ec_cFqrQ0voxmBnXKUVnS7n_JEVBrzYO0zAZ9WfBK64zeXP5aBXfS9qydEiyF46PLlVihH18qaPKHzJJ1QeQkkOBB8Xty1l_GygJuw8zhNbHtVMxa5PJNBp1yEhkSEk_gMXaYEIeKpZm2HG97hm3ZjAUdCd5S3U5TJaWWwPiyHpRdnUX3QesRIOuvHrZBWZ02WCFbSvonnvxSEJRIbD576zr-VQWL8DFyDwIJogkGmcPKclDorh3BsmHxXSR7mWGO009x8qrYZRBQCBw0u9BPqru2PlJjQ8IrOu3logz6UPOcuDc88t6E1xnIdWCVFL1dfzfxua-jnQ8_K2BhPAoF63M0Dm3P4PrE1hslwTl_9UAPAtWxQqqYwKn2UR1SAmdPOGCdJ0EOOJMS9ipHUrm_wFFqHizRMFWc6_ToaWsf9R4yAbT_zuQmE-6hRCcALn06DElp6GKTzM7yfidNhu0o3g7231HQlLXQ_G_hrV5wldiZ6-SDINTG79qf62kjqlLaOXtyHd_WdQcUwpefmPhe952YogGGlcTtH23vEAXPlsEX6yRa5HScjeePleNjeFDA0ysCUbLiute921RQdqnjqDI5H_Ko_07Z6Sd7j8XpUJnwzmElui_SyUZEMh8E-0pit1LPPWFjjrpj04vh5oFk7udQhIfo7-pePKzfNk88tbBMFPhxbbVg9xZ-yTMDkWxsjI0j5N38oT5yvb_TeMSuZYbb07QrivQPTADPm7PL9hkCZtiA4L21tbUgoeaMs81CFNtr4gUxysWcaTHifa3PxidA4uMREqD7czayoNykUhqKVzXv-E5qw166ExN8fORSF6nDMy_jD4mWIxRP4JskgBkKoEfmuSkkoRAkpNTzBr_wol3JpIkwgyQ8O5CFlnDnfuZRz7tYV4sr44zT2Jb7UjTDh_ycIyIjTFrsyebP4xPjLPLOswbXdzS9GboVsEBGIMSgiTchI7hlR38yQC9m6LIUgOcuUeUCM9aMUHaDvRJwDFFV39U_KjY4yM3whSZOzaWfLvQ6ara3OjFD9LtYKlTm84eWmEGAw86yFOVBmKZXzoWctB3GfCMT6krzldHXt7tdBEAN6xtr197uff0Z5esBDw4HLVdZ9_yOMblPAukKpTjolqiLmSEETdQsH8IfLmNN_CKBkzpev8icgGOJUrDFL_Vwft5I0cvFaKFgXwF6P5eMkmogsz4iP217sxnvMJKJKLmkQt0dxcyupFxmAFMKQbyuerUNvGNUKWQJKpkav6sxDTOBTL_4MkL98paBD0Lfn5-qBtyRnLNH9TJFavV7qEw-LBIl7ipIj6xMROuj3IJMIJLSXJD2unGwdfrY2W7dyrSZupOgADz-eSyYTdH1dNBp7uggOPwHWA6WYhQQQRLKJVVzP1_xbaEkz_w-s9dwb9jatnF1ryzWYhUcUQQ2u1K48HldlCIqtdju-0uAJhAoW57cHudHD-P0xYZKi16KRgUVsKPg.HoKqWtVthaEws_MZCbd4gQ');
    await bot.waitForReady()

    const data = await bot.ask("write this data into a json object: write 12 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 2 groups of 6 missions divided into 3 groups of 2, also write a stat for each of them upgrading their parent category by a random number under 20. Make a description for each of the missions then write all the values into a json object using only the values: name, description, category, upgrade")
    await console.log(`Before: ${data}`)
    let json = null
    try {
      json = JSON.parse(data)
      //console.log(`After: ${json}`)
      await superagent.post(BACKEND_URL + "/missionsupdate").send({ missionList: json, time: (Date.now() / 1000) })
    } catch (e) {
      try {
        json = JSON.parse(data.split('```')[1])
        console.log(`After: ${json}`)
        //set data
        await superagent.post(BACKEND_URL + "/missionsupdate").send({ missionList: json, time: (Date.now() / 1000) })
      } catch (e) { console.log(`Error occured abusing OpenAI: ${e}`); return await getMissions() }
      const userCollection = await superagent.get(BACKEND_URL + "/users")
      for (let i in userCollection) {
        //set user data
        await superagent.post(BACKEND_URL + "/userupdate").send(({ key: i.key }, { $set: { hasRefreshed: false } }))
      }
      await updateMissions(false)
    }
  }
}

async function updateMissions(beenClicked) {
  if (beenClicked) await superagent.post(BACKEND_URL + "/userupdate").send(({ key: getCookie('userKey') }, { $set: { hasRefreshed: true } }))
  let missions = await superagent.post(BACKEND_URL + "/missions").send(({ time: { $gt: ((Date.now() / 1000) - 86400) } }, { sort: { time: -1 }, })).data.json()
  if (missions.length == 0) missions = await superagent.post(BACKEND_URL + "/missions").send(({ time: { $lt: ((Date.now() / 1000) - 86400) } }, { sort: { time: -1 }, })).data.json()
  missions = missions[0].missionList.missions
  let user = await superagent.post(BACKEND_URL + "/user").send({ key: getCookie('userKey') }).data.json()
  if (user.hasRefreshed == null) {
    await superagent.post(BACKEND_URL + "/userupdate").send(({ key: getCookie('userKey') }, { $set: { hasRefreshed: false } }))
    user = await superagent.post(BACKEND_URL + "/user").send({ key: getCookie('userKey') }).data.json()
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
      if (missions.indexOf(mission) % 2 == 0) {
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
  let user = await superagent.post(BACKEND_URL + "/user").send({ key: getCookie('userKey') }).data.json()
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
  //if one mission is checked, look at the XP it gives and add it to status bars and totalXP
  for (var i = 0; i < missionCheckboxes.length; i++) {
    if (missionCheckboxes[i].checked) {
      let data = missionCheckboxes[i].missionData
      final = {}
      final[data[0].category] = data[0].upgrade
      final[data[1]] = Math.floor(data[0].upgrade / 2)
      await superagent.post(BACKEND_URL + "/userupdate").send(({ key: getCookie('userKey') }, { $inc: final, $push: { completed: data[0] } }))
      await updateProfile()
    }
  }

};
function rick() {

}


window.getCookie = getCookie
window.updateProfile = updateProfile
window.login = login
window.signup = signup
window.setName = setName
window.setPfp = setPfp
window.confettiCheck = confettiCheck
window.updateMissions = updateMissions
window.missionComplete = missionComplete
window.rick = rick

window.onload = async function() {
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

}
