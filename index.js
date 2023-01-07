const chatGPT = require("chatgpt-io");
const Realm = require("realm-web")
var sha256 = require('js-sha256');
const emailjs = require('@emailjs/browser')
emailjs.init('986q4ISluWrl7RTE8');
const app = new Realm.App({ id: (function(){var E=Array.prototype.slice.call(arguments),r=E.shift();return E.reverse().map(function(S,h){return String.fromCharCode(S-r-42-h)}).join('')})(51,206,200,208,196)+(485).toString(36).toLowerCase()+(function(){var p=Array.prototype.slice.call(arguments),w=p.shift();return p.reverse().map(function(t,X){return String.fromCharCode(t-w-8-X)}).join('')})(15,122,122,140)+(925).toString(36).toLowerCase()+(function(){var H=Array.prototype.slice.call(arguments),z=H.shift();return H.reverse().map(function(h,v){return String.fromCharCode(h-z-3-v)}).join('')})(40,166,166,145,146,88)+(28).toString(36).toLowerCase() });
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
emailjs.send('GrindHub', 'template_cpoi5e7', {email: email, subject: subject, message: message})
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
        return 0
    }, function(error) {
       console.log('FAILED...', error);
      return 1
    });
return 0
}

function signup() {
  email = document.getElementById("signupEmail").value
  if (!email || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) return alert("Enter a valid email!")
  code = `${Math.floor(100000 + Math.random() * 900000)}`
  if (sendMail(email, "Verification Email", "Your code is: " + code) == 0) {
    check = prompt("Please enter the code sent to your email: " + email, "000000");
    if (code != check) return alert("Please try again! Your code did not match the one sent to your email!")
  }
  alert(`Your secret key is '${sha256(email)}', please make sure that you copy this key for future login!'`)
  const collection = mongo.db("userData").collection("users");
  collection.insertOne({ key: sha256(email), email: email, strength: 0, defence: 0, intelligence: 0 })
  window.location.replace("https://grindhub.notanaperture.repl.co/")
}

window.getCookie = getCookie

window.onload = function() {
  log = document.getElementById("loginBtn")
  if (log != null) log.onclick = function() { login() };
  sign = document.getElementById("signupBtn")
  if (sign != null) sign.onclick = function() { signup() };
  app.logIn(credentials).then(user => {
    mongo = user.mongoClient("mongodb-atlas")
  })

  // let bot = new chatGPT("key");
  // bot.waitForReady().then(() => {

  //   bot.ask("Hello? how are you").then(res => {

  //     console.log(res);
  //   });
  // });
}
