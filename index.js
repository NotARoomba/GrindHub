const chatGPT = require("chatgpt-io");
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
    let bot = new chatGPT("eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..y1ZLNmWfniYI8FZg.kSwZ0XrJJItPfxvAuh9op7KXfVdAQIL2uWSaN3aCD5w0ilEqhYuJOa1BTLCBrRzFwAndy7tSrp0i217iFO731I4sYMj-OiD6YOwMD2xsIM37xtAMQzCfAknTLOIPxVU4S8Nos1brMVorxkUV1_P-b96oAKZPadTwWD3-atpVnB2no12s8dfUBULzvhgD_xw2dUA_Ibaampi-WgvScRNfFkGNwRH5n560EioLAlIeOKTNab-HEEzc6jYVTHMP_vPSp4Q_aJYiu7ehRu7PSg06KP9qQKaOG8NxJ_tlNejlD17wGCZJ5wzElyFvKFNXcHMq9oxoDg_yogkgOas0ST3djNlFCbwd4_GbtIRwcaz8XtT59tCv9UdjOtZPqSsT5mh5XUBNBLP29ZsOknyniuUtrKFjdLte9Jl-avYlgCoFHpzx9_cVOx-NixCl3Bq83jdOHh2Lp3eBh_1iIlQvcG9i64ugf61obEMYkuamqkQUOltpRZqHqxm7W4Jj6rk6yN91sB_8WJzJch4zPoI8m6ALl94A8D4c3QiQKSi7icHZjuNAY5AB7LIV7Dnm-vzX1hWCaLCUSjnY6REBZNbu9JOLb1co3Xp2zO_-jlYjqvzLPXUYFG0T-xvAM6wiiRgsFxVY8Xq_lTmyVhyE8X1EmFlBL38YZR_GDalR3zKHGar_lUKUPRBsrBxzI1STdFaG2IPLOOSSrJu7PezPXXZu675jSrPeL6y09owMh_hdqdEywy01qmG67y6MJcpBimjqUnYsIDk5hpHSuWAFWcNCXkwh4iMC4tHKzCGjmL5tX-oG4myScEz3YYIBgIAUc6K7HPTY_n-yNBOm3j1T3NnytfMA63hUygKveNkbTAm0hr7KhL7bmIqjKvS1ISLhji2mQ7bWq18RA3wz6U3B4cWGfsK0WI6H3BMR39p_JjJ5n4Qd9C0L5dHA07Jd1-1Jz7eq0G0Tny8kZoXBa2KSMpKlHMH2l68Xrz3pCZHs-GVYz3pOklAyo2zd_5XlyuyMZeMdzdOR7j627FEBDh6L1SMHnSZjAL9izejpC1X7GOlT-_ZazC9ZBdhQa-9-gFH8BZJiQRnZubemjoeRHiSJphgxEV0W_Qx87Bnh-62dg8jCxWtdl-7qJzHH0AgASuCvkUoJUQMm8oLKuwWbwBOeYDw5MDp7OSLMHBcL6a2heROihM65YdxI2w240KWev7-U-tQrFlwvAUEcIxgxvOFE1HUk7QXJ3zQe09kT_WXI8QzlcrQ0gISpfEXcJU9-LCcB3mE2qSUDBDbnnHps2OWhUpxarYSU8Ddyj8gBHfvC9s0qzmoDW_OzY1ApmABYa1y2-8arYVAJTJUCeROlLOeCB92Q9XTZ4U3HC6N1lQBKZ2tZK3MPJ8N_3LyxDx-mYsoVJiXywaA4NmzqI0HVVYkHgd-SuJulYzb3GG6OuUigxqOUk5nWrYGyv2C4raw2knNP1aRaGvFvsmLcoPFAxAlqpPzhSlBmLtk7X6iVTIg-Q3XKn4zmNOKsEf6kOLQyDquPFQkOoG_W0FaQ831RPqVomWlzjkCBfNv9xMQKkxJ7_Y9zlJMFuUznlZxckMVACiulp4WCwW8QTC7L-aDa094IdnYaZaQjq7Bhsu3t5ojlm3io47dm3q-yUiPPPeloLr83WcGGdBLAtWrqEIXdjpGWjO51KPAzObrjh14BmpzRqYXYbYd_36VNfOmXE6q5PQTpm_NcbDVeXUMKaEltWTSuO_ypmEe0x007DYH83n_UelPKNc7AHizaMTwh3AQ3OS2fOzPlITuAzLM69DnSpfU19_CYo6TZOVE-eOugPtUa3tm9eRX9U9Gh2npt8v770RxIDBHZHQpG-P1pXNPGeT4q6GXZDukdLhcKed-r_sFgWWVXJ0TVxlkvHDmFX-9nDyYbG9fJqHbg19R1vR1-Ey1DNMMowssrYbVWfWj-jlzKRBYLZLOQLSkZ3FHbHrDo86ErkNSxIzx97gdiJ7J4vvFNwoE-bVl--_CRKf2eLAjJ_Ry7INvR5BQV7MEpzltziTW-FS8cwbwRaFdReg32JPnpViiAS1WA6mKu2pNplZh4UcljRGUT5c6goGPo-A93SEmHZiWJG8MKKT7C99IKZbVBjcsiZ5CiSxeoAR8-UTAwno4ggs2T-GEHX8GE4zvTQUtic962ou33CDv5IjeP3eNJjcYSUTg10TmZG57ncRomvBFESz8E4tATIiV9oh6ebn_YKXJqW7GbcaglgI0StZAEeS1DWBx78WdsJNlpJg7qwBYALCIEGDYYdAeguGQhcmDjQCbDKbdxc2utoYBQ408_GJmtn8D2psk6SoNZXum63LobYCUx92AeIQ.b2zPSzvmSdUpMR-r7qgB4A");
    await bot.waitForReady()

    data = await bot.ask("write this data into a json object: write 6 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 3 groups of 2 divided equally, also write a stat for each of them upgrading their parent category by a number under 20. Then write all the values into a json object using only the values: name, category, upgrade")
    try {
      data = JSON.parse(data.split('```')[1])
      console.log(data)
      collection.insertOne({ missionList: data, time: (Date.now() / 1000) })
    } catch (e) { console.log(e); return await getMissions() }
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

async function confettiCheck(){
        c1 = document.getElementById('cbox1');
        c2 = document.getElementById('cbox2');
        c3 = document.getElementById('cbox3');
        c4 = document.getElementById('cbox4');
        c5 = document.getElementById('cbox5');

        
        if (c1.checked == true){
          if (c2.checked == true){
            if (c3.checked == true){
              if (c4.checked == true){
                if (c5.checked == true){
                  start();
                  stop();
                  console.log("all checked")
                }
              }  
            }
          }
        }
}

window.getCookie = getCookie
window.updateProfile = updateProfile
window.login = login
window.signup = signup
window.setName = setName
window.setPfp = setPfp

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
    
    document.getElementById("cbox1").onclick = async function() { await confettiCheck() }
    
    await getMissions()
  }
  //here 
  
}
