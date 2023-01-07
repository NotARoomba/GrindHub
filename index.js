const chatGPT = require("chatgpt-io");
const Realm = require("realm-web")
var sha256 = require('js-sha256');
const app = new Realm.App({ id: "grindhubapp-fdxws" });
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


function login() {
  input = document.getElementById("loginKey").value
  if (!input) return alert("Enter your private key!")
    const collection = mongo.db("userData").collection("users");
    collection.findOne({ key: input }).then(data => {
      if (data == null) {
        return alert("The account attached to this key does not exist")
      }
      else {
        setCookie("userKey", data.key)
        window.location.replace("https://grindhub.notanaperture.repl.co/dashboard.html")
      }
    })

}

function sendMail(email, subject, message) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.set('Authorization', 'Basic NWFhMjczMGE1Mzc1ZDViMTk4ZjhkN2JlM2U5Mjg2NTk6ODU5ZTBjZjAyYTViYjQyYjlhMzhjNWYyNjc0MGQ5ZmU=');

  const data = JSON.stringify({
    "Messages": [{
      "From": {"Email": "GrindHub", "Name": "GrindHub"},
      "To": [{"Email": email, "Name": email.split('@')[0]}],
      "Subject": subject,
      "TextPart": message
    }]
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
  };

  fetch("https://api.mailjet.com/v3.1/send", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => {console.log('error', error);return 1});
  return 0
}

function signup() {
  email = document.getElementById("signupEmail").value
  if (!input || !email.match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')) return alert("Enter a valid email!")
  code = `${Math.floor(100000 + Math.random() * 900000)}`
  if (sendMail(email, "Verification Email", "Your code is: " + code)==0) {
    check = prompt("Please enter the code sent to your email: " + email, "000000");
    if (code!=check) return alert("Please try again! Your code did not match the one sent to your email!")
  }
  alert(`Your secret key is '${sha256(email)}', please make sure that you copy this key for future login!'`)
  const collection = mongo.db("userData").collection("users");
  collection.insertOne({key: sha256(email), email: email, strength: 0, defence: 0, intelligence: 0})
  window.location.replace("https://grindhub.notanaperture.repl.co/")
}

window.getCookie = getCookie

window.onload = function() {
  try {
  document.getElementById("loginbtn").onclick = function() { login() };
  } catch  {}
  try {
  document.getElementById("signupbtn").onclick = function() { signup() };
  } catch {}
  app.logIn(credentials).then(user => {
    mongo = user.mongoClient("mongodb-atlas")
  })
    
  let bot = new chatGPT("eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..EBv_4afHaG9rMJZ2.SVJzyuToFk4vTud-nx2-HOoChcTwqvg9EQysMddInrL9gThPXo1BtLLqUObrxa0vHxl2iMZBmsMpDww3MdxWGINc3aDctqqHwgKb9YW_SUOLYhdar9AfjbDjbJnQb-WSwWI9hBQ__AuUhu4zsGX0QV5vAA0wH2goSfC7Gj9NWi_LW7p0kKbwtE052_N5An_jHMm9AFuJ2yZpddaN2p90uXIpjEsuQr9k9hftTYby5DY7U-ZExyBgON9TVkc9-wB9zIQsP3xqzKkYPkgVjT1Rtv4_E8P2zhilkPYIkV-T569HX53oqVNXd-pIghd_VqQqfbAtCTAm-4FQ7EDsosi1qvKqyHbwWy1515ypg08huUDGNVe9uLm87YRyKWvCiyVL0FnQicJWGkAGCy6iAiV9nrtUvpoTIqJSvu_EavzyCXun0jhEuw0Vmtnn3y1ZbXvVvxTFHTP_WopRMTaJBQWtEMXZAo9_oHjGEv8ikpxXA3zlUXAfkpPrGNHW_hgfQWg_ZEoQ6n1k6zUNFxcug9jEuCULnCTjt3amF1nZoRT6ZMhLpX2uBduCvcUFbQJ4DrY1WoKPWo8-TdwcAxtNV0S3PJyy_aLOV5WyG5Zfx52gEkGL2-o6pFgkdqJBXmmMpResiD5saa1Ehm4xW9x72EB5qgRcJCjwCkPSZIOIR5-c-MnRN-DK5KuebqBEYRcv6uDL7x-Rhbt5x2nD5dztmHECbW-5Pup6j0OeO8kzDNFPbC39h_-ubCJ2twt2WUmefN7IIV8ZtG4KcEum_VPfxX__UbD5ydiPuc53204k-e49yvVWbtmtDCucRmUQQ-u8iO4NthYXXYzckZ9nDZKxKc-RqjL9UnqtfRRWNAnfQwd0ROWj3_VBQheupYL9fnngRmvHo2xClwrP_mbc7SlTF-Qll3mAf36mcGq7TsA8Q3MJ5QWMxhaRq3AltC7ZZAnda7aDcvbhPe64gthbC1-CzaS3tShVUyBEh8XJQa9-w6FEG7DKPrfPoz4QKv5XWhs14yWvomVVp7Rx20CnJc3VKjOFRzrNJd3xDCm2fLSE-4d6c9Td_celeAPLfhw-nm1jQ1Xca1lyjQpn8QOEqn7pO4yKnqW2Bs2Slx0eJHzps3F45KPRmGUPLNfx5vSzfdEMDoefvmIQbpGYa8qVdb8_2gFRZjUXmFiWVPHOxEMBwzbs0QaI8ac4o4ZoSVpGNbwO5LlFK9omrJjAGCg6dIduXavn6DeNzwZhLH0Siccgwvdv3DxyfPNERbr50fucrI8dwsgML--DnFq-fOGnoe3pBgWZN90yWO33mf66f0OavTCZ3ySCH1fOjmoVvqOW7SCgKHMf69aXqEA3ybD5ixZyb-CpgyB25veT3i5-T6R3ar0-JMt0f1G_ofZ-w1TOoEzlCb36xFKj2Q8C9OqeSnU-7AJGphPbQnHS6wKxHddGMoiy0FTHTCc_q6jLFOfM5Uux-TYMVlrRiRknd2ORyaxY8EfTB6w4Qi57J2qPYjGFaWtqXGXHG8nlla68bcafGP7u0kr5bQx7x7gyxPfDEDIsqCjEosLOy_SiDQ7LmUHtvDNWNN_UCRqcf4k50XslmOL1EcWSmsN06HOWfrJ1nw9W2Cw53suy_4bIfBcEhrISkzD7266oNj8ITAa16qJdm6mT__PvLRNvhtp18NjAWTN-jTvIaIhTIvDxQQWZNWUnFJ3NgqbTAz9Xp0EmncTbsyZhc0qv0tdUEcQdIJaoBdUCLv5rdew4NOURjYjvLAaKyIoMwJn2G-7SAK2AXAlzdQnuX8X6BHZy3eDp1z-PZslSD5_788_SUE-XkBWjzG4MCMKNNPVMX_reBEcWhKtKFbu2NdssGsupMmZPf8UqqdmwtnnOKbF3N7Ov9t6UdmPpgLffak_17uOaKj4yYya__FZu-ZTH1hFcqHcrdJEnAOWPCo_0_Oaz-iXjFSVg2hj2YEOMCmoC9AYygIygQGRy4A-GQ0ZRY2xir07tydHryr5yrEH2JFMhzhU-2SJpy2w8XJrzIY4vYlkqIULJLHOi1i3xWisK1ntnd2crdb9g7DAhCn-rM4gjCaQlaad6VLJD6C4cmJvrHJRGF0YXup0tfL1JtcbQH3YRkljyNqAPIXiT07aQQWEJXhjfZShYOTYMcOcx5pEbjmlLsvgDZEqze8g8So7sOqLNV-n-xQ50FyWpcfCHlQyaSPf9XKseYz6QbcDoIo7O7vopK1Ph0efMruH2Cd6ChYLX5nQySCCrTqRM7__Ic_r1fhPcR51z2V9-vogbYT3kUOKM2OiR71iT13qUk3684ibD0DeOQw45T0s00nssxATxtTTKP6-05dyBASaf1CwTzx_Yy_c.j4KQLoscPDbm2l4eozzEFQ");
  bot.waitForReady().then(() => {

    bot.ask("Hello? how are you").then(res => {

      console.log(res);
    });
  });
}
