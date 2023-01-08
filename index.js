const chatGPT = require("chatgpt-io");
const { ChatGPTClient } = require('unofficial-chatgpt-api');
//const chatGPT = require('chatgpt')
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
  email = document.getElementById("signupEmail").value
  if (!email || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) return alert("Enter a valid email!")
  code = `${Math.floor(100000 + Math.random() * 900000)}`
  if (sendMail(email, "Verification Email", "Your code is: " + code) == 0) {
    check = prompt("Please enter the code sent to your email: " + email, "000000");
    if (code != check) return alert("Please try again! Your code did not match the one sent to your email!")
  }
  try {
    const collection = mongo.db("userData").collection("users");
    while (true) {
      let name = prompt("What would you like your username to be?");
      let user = await collection.findOne({ name: name })
      if (!user) break;
      else if (name == user.name) alert("That username is taken!")
      else break;
    }
    alert(`Your secret key is '${sha256(email)}', please make sure that you copy this key for future login!'`)
    await collection.insertOne({ key: sha256(email), email: email, name: name, image: null, strength: 0, defence: 0, intelligence: 0 })
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
    // await bot.waitForReady()

    const gpt = new ChatGPTClient({
      clearanceToken: '.NFxnQSCspWK.QH8qcE2aXZvLTXqL6yJeo6O6lajbW0-1673184210-0-1-6ed987fe.4165c997.69e48cb6-250',
      sessionToken0: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..P11kfRBor2GvVCv1.hRzqYYT964BxP5_lTgBi45ykospJJuFvd_9ZD4dwIMaD8ijXmOWec50Sar-JBGidoYeNltIPSUJ92WovhOlqfj3x6r7RE_7qmfOtVOCRpbqboRG7j3DUk2TiD92OiBcIUjYgaDR-9H7rk6B_IZD27DwTFgUuMQms8qWAwlVCtw_O0PEm0_Qhq52P7YDWwbbSKVirvRetzjqLHuTllKewhL7AOYmr4vZ-f5Lfn5PIbToekCUBoS_xvVQqRjWuZUl_jJpe4vFjyjnhew02TxvxefVs6cecpnigwvQ2CwJ7fJRfudb8g4HmAntLuiR5hayrNIVgOvymGb-4BK7PCQZ58sOpK96s4lAC9wXINm935Fpl1C58eVDrCjOezcNQk7Nrj9ra4Su_TRpOhBSNUnKElmP0c_oNiUae_ftPL13sQulpCG3LxxaVmkZFkgGsiMaJIWv6BLNlX5lqnnuhp1Xqcvh4iIOvk02aoLsDN8oyz9caC97uUi19ZwLF6jRrS3-pwMRWro0Y9n362sggI_GnYJSLguyqZSWXsIDaTGqK7cK3nWswuVEueCL4xH867d6Erw_LUvDMArs-rSM_EERqAnbK9caJVpk2aNOmz8DsnH_gluv95vo9BaJap0oMKC6v8EwrN1AvVny7hQjpiXUcyTSGep8ei42R1EtaXWcSJ5khj1De1hdWAp9DaulWBTaCZ6Xqs3RQTeBKqp_owxqWuwOEDQoekV-qCimHHjd1i_omiwNVSAAjEDPPky8SMynUNfsNfS4ECOWQOMLl6HWxIXEb3kXmDsRyXkNsTw6O6b1hhBFuNa2MhRiAmL8wTPXi5D_DcjSWbe7aUopGNFuucuejYaXYEPAXKkCHljwH2Tu0iXVeZ1jq32c5QfQ7Z3PC6lmhN5XO9C1rd2fQCgec6MMNKWubzTNmR6BOdjhHgicaJofb92p3swHttTfHn7t54P642tpfBd05k0xZHfMnrwRzQcIZkYuLqwRk7spbhPBl5_tbut0LQlWNuRRLgvfRm_naS19XZtAeNwfN2bL8L1Kn6GONIG-8jDH63ntc5CDJkx32rZlzQH6Aw3-NTjSEn7dvsyKeLRSpPlj6ng1LVx8G6aKb5-3qpN8nNMPc9ecoRd56t58EFTFVMT4eSVmd14kAgsw6HKyOdEgEbjtjl2XgUmSPwbsOWHtYtDgnupSiVcVAuPDnl6MMTbgTgqKBtj26nCowOn_LRyaohrPW2badh1OsUHha39ALDWQueOT1HPlVd0jIyqj_heUTBN_jUEOX1MN3036p77YdJE7zi0Ea4LP_CKlsKHXKASV9MBcBRJGJQb52prCt36gowAvQeW5L2gFlOhNmV1ZT_K4NtEQSXJnZmFrAjilwGc0Ta9Ko_UptWEHXS3QJ_AJNRVHNoFWRF_diy_88zwE08gssU4LFAJIP8fUeEPO8RlbdjsPUlUEtTmknfx0ID1EudPMSpe7nIAHbqxTw9h_YO4-onmeAMcb5SotZ3wZrX2FK3eIbow-Hc1tKGgha4beXHECsjPEBy3DmSQX4291IrGw9Nesyu1iXM1WR1iAT3gIrG-8R1mEoM2jAKA1_IQexouMNVqYJN2ZVPliZUr5Y5vKs4r9jfjhBOT_0xh2LJ2zSRRpATZPvbe-7ebh9TUueS_3ovY3r9SNjeRe6I4Izixsx8EpcxZ8PwQ5I_lQ3bxwm9ObZXZZ9cw7lF3rXwJ30pGAHdV2iwzK5MyYsTPgfummEIyFvEUl1Vniw_e3ELrvhM4-KTrVX3jrQWYyWj6CCVHYKWlvD0b44ZvKCUIU4qP1q7oF9bp2AR4w3I2oIT0foYbktiidMSN9pH1MfLoagp_nMwpSGee0t8KiGx4NcYLwvPJ9mWdFUaP8LZOC49fBM4fCfeZUkQ3UwHW4SfSzm6iuo_iccYxNgbB08e0iK6feaxLMfCl8SvLoCAJaAenj_v0lD1w0EDvKMEe9A5W7298-kB9W74Y69bVcdK-UKrdBThPc1e-Wj38ISOyxwcUNNfMHbJ-2-ZXKauRCyTXBQSdFz94Wq0enSKBluIwuvyXepM03BLbXDxDeZKWdeq4Ox7Cw36WRgQ-P_aJWELxkcrMrVo8AVAndlfmp6dk0jXdygS6TAEEapu0a-MoJ3diyOfMU4bhHCEjdg_DMIXfueDxoU0lCI4hDClRkPF6DB074H5E-Q9Ar196c7joBXVQn15lTA5BMzGp149pcpRwabse1y-8Vv5GhTksmahKN6C5HqGVCHJQSwvg.pnZgp1740HSAYRwWKsDIEA',
    });
    const convo = await gpt.startConversation()
    const data = await convo.chat("write this data into a json object: write 6 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 3 groups of 2 divided equally, also write a stat for each of them upgrading their parent category by a number under 20. Make a description for each of the missions then write all the values into a json object using only the values: name, description, category, upgrade")
    await console.log(`Before: ${data}`)
    try {
      data = JSON.parse(data.split('```')[1])
      console.log(`After: ${data}`)
      collection.insertOne({ missionList: data, time: (Date.now() / 1000) })
    } catch (e) { console.log(`Error occured abusing OpenAI: ${e}`); return await getMissions() }
    updateMissions()
  }
}

async function updateMissions() {
  //TODO
}

async function textboxColor() {
  var elements = document.querySelectorAll('.mission-board');
  for (let i of elements) {
    console.log(i)
  }
  // if (checkBox.checked == true){
  //   text.style.background-color = "#1e0656";
  // }
  //  else{

  //  }
}

async function confettiCheck() {
  var missionCheckboxes = document.querySelectorAll('.mission .checkbox');
  for (var i = 0; i < missionCheckboxes.length; i++) {
    if (!missionCheckboxes[i].checked) {
      return false;
    }
  }
  return true;
}

var r = document.querySelector(':root');

function changeXP() {
  var strengthXP = '40%';
  var defenseXP = '4%';
  var intelligenceXP = '4%';
  var overallXP = '45%';
 
  r.style.setProperty('--strengthBar', strengthXP);
  r.style.setProperty('--defenseBar', defenseXP);
  r.style.setProperty('--intelligenceBar', intelligenceXP);
  r.style.setProperty('--overallBar', overallXP);
  console.log("stats changed")
};

var userLevel = 1;
function changeLevel() {
  level = document.getElementById('levelNumber');
  level.innerHTML = userLevel;
  console.log("lvl changed")
};


window.getCookie = getCookie
window.updateProfile = updateProfile
window.login = login
window.signup = signup
window.setName = setName
window.setPfp = setPfp
window.changeXP = changeXP
window.changeLevel = changeLevel

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
    changeXP();
    changeLevel();
    await getMissions()
    document.getElementById("cbox1").onclick = async function() { await confettiCheck() }


  }
  //here 

}
