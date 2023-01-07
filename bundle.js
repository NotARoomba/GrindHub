(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"@emailjs/browser":3,"chatgpt-io":14,"js-sha256":37,"realm-web":40}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPost = void 0;
const EmailJSResponseStatus_1 = require("../models/EmailJSResponseStatus");
const store_1 = require("../store/store");
const sendPost = (url, data, headers = {}) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', ({ target }) => {
            const responseStatus = new EmailJSResponseStatus_1.EmailJSResponseStatus(target);
            if (responseStatus.status === 200 || responseStatus.text === 'OK') {
                resolve(responseStatus);
            }
            else {
                reject(responseStatus);
            }
        });
        xhr.addEventListener('error', ({ target }) => {
            reject(new EmailJSResponseStatus_1.EmailJSResponseStatus(target));
        });
        xhr.open('POST', store_1.store._origin + url, true);
        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
        xhr.send(data);
    });
};
exports.sendPost = sendPost;

},{"../models/EmailJSResponseStatus":7,"../store/store":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForm = exports.send = exports.init = void 0;
const init_1 = require("./methods/init/init");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return init_1.init; } });
const send_1 = require("./methods/send/send");
Object.defineProperty(exports, "send", { enumerable: true, get: function () { return send_1.send; } });
const sendForm_1 = require("./methods/sendForm/sendForm");
Object.defineProperty(exports, "sendForm", { enumerable: true, get: function () { return sendForm_1.sendForm; } });
exports.default = {
    init: init_1.init,
    send: send_1.send,
    sendForm: sendForm_1.sendForm,
};

},{"./methods/init/init":4,"./methods/send/send":5,"./methods/sendForm/sendForm":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const store_1 = require("../../store/store");
/**
 * Initiation
 * @param {string} publicKey - set the EmailJS public key
 * @param {string} origin - set the EmailJS origin
 */
const init = (publicKey, origin = 'https://api.emailjs.com') => {
    store_1.store._userID = publicKey;
    store_1.store._origin = origin;
};
exports.init = init;

},{"../../store/store":8}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const store_1 = require("../../store/store");
const validateParams_1 = require("../../utils/validateParams");
const sendPost_1 = require("../../api/sendPost");
/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templatePrams - the template params, what will be set to the EmailJS template
 * @param {string} publicKey - the EmailJS public key
 * @returns {Promise<EmailJSResponseStatus>}
 */
const send = (serviceID, templateID, templatePrams, publicKey) => {
    const uID = publicKey || store_1.store._userID;
    (0, validateParams_1.validateParams)(uID, serviceID, templateID);
    const params = {
        lib_version: '3.10.0',
        user_id: uID,
        service_id: serviceID,
        template_id: templateID,
        template_params: templatePrams,
    };
    return (0, sendPost_1.sendPost)('/api/v1.0/email/send', JSON.stringify(params), {
        'Content-type': 'application/json',
    });
};
exports.send = send;

},{"../../api/sendPost":2,"../../store/store":8,"../../utils/validateParams":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForm = void 0;
const store_1 = require("../../store/store");
const validateParams_1 = require("../../utils/validateParams");
const sendPost_1 = require("../../api/sendPost");
const findHTMLForm = (form) => {
    let currentForm;
    if (typeof form === 'string') {
        currentForm = document.querySelector(form);
    }
    else {
        currentForm = form;
    }
    if (!currentForm || currentForm.nodeName !== 'FORM') {
        throw 'The 3rd parameter is expected to be the HTML form element or the style selector of form';
    }
    return currentForm;
};
/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {string} publicKey - the EmailJS public key
 * @returns {Promise<EmailJSResponseStatus>}
 */
const sendForm = (serviceID, templateID, form, publicKey) => {
    const uID = publicKey || store_1.store._userID;
    const currentForm = findHTMLForm(form);
    (0, validateParams_1.validateParams)(uID, serviceID, templateID);
    const formData = new FormData(currentForm);
    formData.append('lib_version', '3.10.0');
    formData.append('service_id', serviceID);
    formData.append('template_id', templateID);
    formData.append('user_id', uID);
    return (0, sendPost_1.sendPost)('/api/v1.0/email/send-form', formData);
};
exports.sendForm = sendForm;

},{"../../api/sendPost":2,"../../store/store":8,"../../utils/validateParams":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailJSResponseStatus = void 0;
class EmailJSResponseStatus {
    constructor(httpResponse) {
        this.status = httpResponse ? httpResponse.status : 0;
        this.text = httpResponse ? httpResponse.responseText : 'Network Error';
    }
}
exports.EmailJSResponseStatus = EmailJSResponseStatus;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
exports.store = {
    _origin: 'https://api.emailjs.com',
};

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = void 0;
const validateParams = (publicKey, serviceID, templateID) => {
    if (!publicKey) {
        throw 'The public key is required. Visit https://dashboard.emailjs.com/admin/account';
    }
    if (!serviceID) {
        throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
    }
    if (!templateID) {
        throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
    }
    return true;
};
exports.validateParams = validateParams;

},{}],10:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

exports.Emitter = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

// alias used for reserved events (protected method)
Emitter.prototype.emitReserved = Emitter.prototype.emit;

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],11:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],12:[function(require,module,exports){
(function (global,Buffer){(function (){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BSON = {}));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var byteLength_1 = byteLength;
	var toByteArray_1 = toByteArray;
	var fromByteArray_1 = fromByteArray;
	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	} // Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications


	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens(b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4');
	  } // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42


	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;
	  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
	  return [validLen, placeHoldersLen];
	} // base64 is 4/3 + up to two characters of the original data


	function byteLength(b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}

	function _byteLength(b64, validLen, placeHoldersLen) {
	  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}

	function toByteArray(b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
	  var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

	  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
	  var i;

	  for (i = 0; i < len; i += 4) {
	    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = tmp >> 16 & 0xFF;
	    arr[curByte++] = tmp >> 8 & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
	    arr[curByte++] = tmp >> 8 & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr;
	}

	function tripletToBase64(num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
	}

	function encodeChunk(uint8, start, end) {
	  var tmp;
	  var output = [];

	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }

	  return output.join('');
	}

	function fromByteArray(uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3
	  // go through the array every three bytes, we'll deal with trailing stuff later

	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
	  } // pad the end with zeros, but make sure to not forget the extra bytes


	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
	  }

	  return parts.join('');
	}

	var base64Js = {
	  byteLength: byteLength_1,
	  toByteArray: toByteArray_1,
	  fromByteArray: fromByteArray_1
	};

	/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
	var read = function read(buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];
	  i += d;
	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;

	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;

	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }

	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	var write = function write(buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);

	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }

	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }

	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;

	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

	var ieee754 = {
	  read: read,
	  write: write
	};

	var buffer$1 = createCommonjsModule(function (module, exports) {

	  var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' ? // eslint-disable-line dot-notation
	  Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
	  : null;
	  exports.Buffer = Buffer;
	  exports.SlowBuffer = SlowBuffer;
	  exports.INSPECT_MAX_BYTES = 50;
	  var K_MAX_LENGTH = 0x7fffffff;
	  exports.kMaxLength = K_MAX_LENGTH;
	  /**
	   * If `Buffer.TYPED_ARRAY_SUPPORT`:
	   *   === true    Use Uint8Array implementation (fastest)
	   *   === false   Print warning and recommend using `buffer` v4.x which has an Object
	   *               implementation (most compatible, even IE6)
	   *
	   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	   * Opera 11.6+, iOS 4.2+.
	   *
	   * We report that the browser does not support typed arrays if the are not subclassable
	   * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
	   * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
	   * for __proto__ and has a buggy typed array implementation.
	   */

	  Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

	  if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
	  }

	  function typedArraySupport() {
	    // Can typed array instances can be augmented?
	    try {
	      var arr = new Uint8Array(1);
	      var proto = {
	        foo: function foo() {
	          return 42;
	        }
	      };
	      Object.setPrototypeOf(proto, Uint8Array.prototype);
	      Object.setPrototypeOf(arr, proto);
	      return arr.foo() === 42;
	    } catch (e) {
	      return false;
	    }
	  }

	  Object.defineProperty(Buffer.prototype, 'parent', {
	    enumerable: true,
	    get: function get() {
	      if (!Buffer.isBuffer(this)) return undefined;
	      return this.buffer;
	    }
	  });
	  Object.defineProperty(Buffer.prototype, 'offset', {
	    enumerable: true,
	    get: function get() {
	      if (!Buffer.isBuffer(this)) return undefined;
	      return this.byteOffset;
	    }
	  });

	  function createBuffer(length) {
	    if (length > K_MAX_LENGTH) {
	      throw new RangeError('The value "' + length + '" is invalid for option "size"');
	    } // Return an augmented `Uint8Array` instance


	    var buf = new Uint8Array(length);
	    Object.setPrototypeOf(buf, Buffer.prototype);
	    return buf;
	  }
	  /**
	   * The Buffer constructor returns instances of `Uint8Array` that have their
	   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	   * returns a single octet.
	   *
	   * The `Uint8Array` prototype remains unmodified.
	   */


	  function Buffer(arg, encodingOrOffset, length) {
	    // Common case.
	    if (typeof arg === 'number') {
	      if (typeof encodingOrOffset === 'string') {
	        throw new TypeError('The "string" argument must be of type string. Received type number');
	      }

	      return allocUnsafe(arg);
	    }

	    return from(arg, encodingOrOffset, length);
	  }

	  Buffer.poolSize = 8192; // not used by this implementation

	  function from(value, encodingOrOffset, length) {
	    if (typeof value === 'string') {
	      return fromString(value, encodingOrOffset);
	    }

	    if (ArrayBuffer.isView(value)) {
	      return fromArrayView(value);
	    }

	    if (value == null) {
	      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + babelHelpers["typeof"](value));
	    }

	    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
	      return fromArrayBuffer(value, encodingOrOffset, length);
	    }

	    if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
	      return fromArrayBuffer(value, encodingOrOffset, length);
	    }

	    if (typeof value === 'number') {
	      throw new TypeError('The "value" argument must not be of type number. Received type number');
	    }

	    var valueOf = value.valueOf && value.valueOf();

	    if (valueOf != null && valueOf !== value) {
	      return Buffer.from(valueOf, encodingOrOffset, length);
	    }

	    var b = fromObject(value);
	    if (b) return b;

	    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
	      return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
	    }

	    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + babelHelpers["typeof"](value));
	  }
	  /**
	   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	   * if value is a number.
	   * Buffer.from(str[, encoding])
	   * Buffer.from(array)
	   * Buffer.from(buffer)
	   * Buffer.from(arrayBuffer[, byteOffset[, length]])
	   **/


	  Buffer.from = function (value, encodingOrOffset, length) {
	    return from(value, encodingOrOffset, length);
	  }; // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
	  // https://github.com/feross/buffer/pull/148


	  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
	  Object.setPrototypeOf(Buffer, Uint8Array);

	  function assertSize(size) {
	    if (typeof size !== 'number') {
	      throw new TypeError('"size" argument must be of type number');
	    } else if (size < 0) {
	      throw new RangeError('The value "' + size + '" is invalid for option "size"');
	    }
	  }

	  function alloc(size, fill, encoding) {
	    assertSize(size);

	    if (size <= 0) {
	      return createBuffer(size);
	    }

	    if (fill !== undefined) {
	      // Only pay attention to encoding if it's a string. This
	      // prevents accidentally sending in a number that would
	      // be interpreted as a start offset.
	      return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
	    }

	    return createBuffer(size);
	  }
	  /**
	   * Creates a new filled Buffer instance.
	   * alloc(size[, fill[, encoding]])
	   **/


	  Buffer.alloc = function (size, fill, encoding) {
	    return alloc(size, fill, encoding);
	  };

	  function allocUnsafe(size) {
	    assertSize(size);
	    return createBuffer(size < 0 ? 0 : checked(size) | 0);
	  }
	  /**
	   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	   * */


	  Buffer.allocUnsafe = function (size) {
	    return allocUnsafe(size);
	  };
	  /**
	   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	   */


	  Buffer.allocUnsafeSlow = function (size) {
	    return allocUnsafe(size);
	  };

	  function fromString(string, encoding) {
	    if (typeof encoding !== 'string' || encoding === '') {
	      encoding = 'utf8';
	    }

	    if (!Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding);
	    }

	    var length = byteLength(string, encoding) | 0;
	    var buf = createBuffer(length);
	    var actual = buf.write(string, encoding);

	    if (actual !== length) {
	      // Writing a hex string, for example, that contains invalid characters will
	      // cause everything after the first invalid character to be ignored. (e.g.
	      // 'abxxcd' will be treated as 'ab')
	      buf = buf.slice(0, actual);
	    }

	    return buf;
	  }

	  function fromArrayLike(array) {
	    var length = array.length < 0 ? 0 : checked(array.length) | 0;
	    var buf = createBuffer(length);

	    for (var i = 0; i < length; i += 1) {
	      buf[i] = array[i] & 255;
	    }

	    return buf;
	  }

	  function fromArrayView(arrayView) {
	    if (isInstance(arrayView, Uint8Array)) {
	      var copy = new Uint8Array(arrayView);
	      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
	    }

	    return fromArrayLike(arrayView);
	  }

	  function fromArrayBuffer(array, byteOffset, length) {
	    if (byteOffset < 0 || array.byteLength < byteOffset) {
	      throw new RangeError('"offset" is outside of buffer bounds');
	    }

	    if (array.byteLength < byteOffset + (length || 0)) {
	      throw new RangeError('"length" is outside of buffer bounds');
	    }

	    var buf;

	    if (byteOffset === undefined && length === undefined) {
	      buf = new Uint8Array(array);
	    } else if (length === undefined) {
	      buf = new Uint8Array(array, byteOffset);
	    } else {
	      buf = new Uint8Array(array, byteOffset, length);
	    } // Return an augmented `Uint8Array` instance


	    Object.setPrototypeOf(buf, Buffer.prototype);
	    return buf;
	  }

	  function fromObject(obj) {
	    if (Buffer.isBuffer(obj)) {
	      var len = checked(obj.length) | 0;
	      var buf = createBuffer(len);

	      if (buf.length === 0) {
	        return buf;
	      }

	      obj.copy(buf, 0, 0, len);
	      return buf;
	    }

	    if (obj.length !== undefined) {
	      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
	        return createBuffer(0);
	      }

	      return fromArrayLike(obj);
	    }

	    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
	      return fromArrayLike(obj.data);
	    }
	  }

	  function checked(length) {
	    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
	    // length is NaN (which is otherwise coerced to zero.)
	    if (length >= K_MAX_LENGTH) {
	      throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
	    }

	    return length | 0;
	  }

	  function SlowBuffer(length) {
	    if (+length != length) {
	      // eslint-disable-line eqeqeq
	      length = 0;
	    }

	    return Buffer.alloc(+length);
	  }

	  Buffer.isBuffer = function isBuffer(b) {
	    return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
	  };

	  Buffer.compare = function compare(a, b) {
	    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
	    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);

	    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
	    }

	    if (a === b) return 0;
	    var x = a.length;
	    var y = b.length;

	    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	      if (a[i] !== b[i]) {
	        x = a[i];
	        y = b[i];
	        break;
	      }
	    }

	    if (x < y) return -1;
	    if (y < x) return 1;
	    return 0;
	  };

	  Buffer.isEncoding = function isEncoding(encoding) {
	    switch (String(encoding).toLowerCase()) {
	      case 'hex':
	      case 'utf8':
	      case 'utf-8':
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	      case 'base64':
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return true;

	      default:
	        return false;
	    }
	  };

	  Buffer.concat = function concat(list, length) {
	    if (!Array.isArray(list)) {
	      throw new TypeError('"list" argument must be an Array of Buffers');
	    }

	    if (list.length === 0) {
	      return Buffer.alloc(0);
	    }

	    var i;

	    if (length === undefined) {
	      length = 0;

	      for (i = 0; i < list.length; ++i) {
	        length += list[i].length;
	      }
	    }

	    var buffer = Buffer.allocUnsafe(length);
	    var pos = 0;

	    for (i = 0; i < list.length; ++i) {
	      var buf = list[i];

	      if (isInstance(buf, Uint8Array)) {
	        if (pos + buf.length > buffer.length) {
	          Buffer.from(buf).copy(buffer, pos);
	        } else {
	          Uint8Array.prototype.set.call(buffer, buf, pos);
	        }
	      } else if (!Buffer.isBuffer(buf)) {
	        throw new TypeError('"list" argument must be an Array of Buffers');
	      } else {
	        buf.copy(buffer, pos);
	      }

	      pos += buf.length;
	    }

	    return buffer;
	  };

	  function byteLength(string, encoding) {
	    if (Buffer.isBuffer(string)) {
	      return string.length;
	    }

	    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
	      return string.byteLength;
	    }

	    if (typeof string !== 'string') {
	      throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + babelHelpers["typeof"](string));
	    }

	    var len = string.length;
	    var mustMatch = arguments.length > 2 && arguments[2] === true;
	    if (!mustMatch && len === 0) return 0; // Use a for loop to avoid recursion

	    var loweredCase = false;

	    for (;;) {
	      switch (encoding) {
	        case 'ascii':
	        case 'latin1':
	        case 'binary':
	          return len;

	        case 'utf8':
	        case 'utf-8':
	          return utf8ToBytes(string).length;

	        case 'ucs2':
	        case 'ucs-2':
	        case 'utf16le':
	        case 'utf-16le':
	          return len * 2;

	        case 'hex':
	          return len >>> 1;

	        case 'base64':
	          return base64ToBytes(string).length;

	        default:
	          if (loweredCase) {
	            return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
	          }

	          encoding = ('' + encoding).toLowerCase();
	          loweredCase = true;
	      }
	    }
	  }

	  Buffer.byteLength = byteLength;

	  function slowToString(encoding, start, end) {
	    var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	    // property of a typed array.
	    // This behaves neither like String nor Uint8Array in that we set start/end
	    // to their upper/lower bounds if the value passed is out of range.
	    // undefined is handled specially as per ECMA-262 6th Edition,
	    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

	    if (start === undefined || start < 0) {
	      start = 0;
	    } // Return early if start > this.length. Done here to prevent potential uint32
	    // coercion fail below.


	    if (start > this.length) {
	      return '';
	    }

	    if (end === undefined || end > this.length) {
	      end = this.length;
	    }

	    if (end <= 0) {
	      return '';
	    } // Force coercion to uint32. This will also coerce falsey/NaN values to 0.


	    end >>>= 0;
	    start >>>= 0;

	    if (end <= start) {
	      return '';
	    }

	    if (!encoding) encoding = 'utf8';

	    while (true) {
	      switch (encoding) {
	        case 'hex':
	          return hexSlice(this, start, end);

	        case 'utf8':
	        case 'utf-8':
	          return utf8Slice(this, start, end);

	        case 'ascii':
	          return asciiSlice(this, start, end);

	        case 'latin1':
	        case 'binary':
	          return latin1Slice(this, start, end);

	        case 'base64':
	          return base64Slice(this, start, end);

	        case 'ucs2':
	        case 'ucs-2':
	        case 'utf16le':
	        case 'utf-16le':
	          return utf16leSlice(this, start, end);

	        default:
	          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	          encoding = (encoding + '').toLowerCase();
	          loweredCase = true;
	      }
	    }
	  } // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
	  // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
	  // reliably in a browserify context because there could be multiple different
	  // copies of the 'buffer' package in use. This method works even for Buffer
	  // instances that were created from another copy of the `buffer` package.
	  // See: https://github.com/feross/buffer/issues/154


	  Buffer.prototype._isBuffer = true;

	  function swap(b, n, m) {
	    var i = b[n];
	    b[n] = b[m];
	    b[m] = i;
	  }

	  Buffer.prototype.swap16 = function swap16() {
	    var len = this.length;

	    if (len % 2 !== 0) {
	      throw new RangeError('Buffer size must be a multiple of 16-bits');
	    }

	    for (var i = 0; i < len; i += 2) {
	      swap(this, i, i + 1);
	    }

	    return this;
	  };

	  Buffer.prototype.swap32 = function swap32() {
	    var len = this.length;

	    if (len % 4 !== 0) {
	      throw new RangeError('Buffer size must be a multiple of 32-bits');
	    }

	    for (var i = 0; i < len; i += 4) {
	      swap(this, i, i + 3);
	      swap(this, i + 1, i + 2);
	    }

	    return this;
	  };

	  Buffer.prototype.swap64 = function swap64() {
	    var len = this.length;

	    if (len % 8 !== 0) {
	      throw new RangeError('Buffer size must be a multiple of 64-bits');
	    }

	    for (var i = 0; i < len; i += 8) {
	      swap(this, i, i + 7);
	      swap(this, i + 1, i + 6);
	      swap(this, i + 2, i + 5);
	      swap(this, i + 3, i + 4);
	    }

	    return this;
	  };

	  Buffer.prototype.toString = function toString() {
	    var length = this.length;
	    if (length === 0) return '';
	    if (arguments.length === 0) return utf8Slice(this, 0, length);
	    return slowToString.apply(this, arguments);
	  };

	  Buffer.prototype.toLocaleString = Buffer.prototype.toString;

	  Buffer.prototype.equals = function equals(b) {
	    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	    if (this === b) return true;
	    return Buffer.compare(this, b) === 0;
	  };

	  Buffer.prototype.inspect = function inspect() {
	    var str = '';
	    var max = exports.INSPECT_MAX_BYTES;
	    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
	    if (this.length > max) str += ' ... ';
	    return '<Buffer ' + str + '>';
	  };

	  if (customInspectSymbol) {
	    Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
	  }

	  Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
	    if (isInstance(target, Uint8Array)) {
	      target = Buffer.from(target, target.offset, target.byteLength);
	    }

	    if (!Buffer.isBuffer(target)) {
	      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + babelHelpers["typeof"](target));
	    }

	    if (start === undefined) {
	      start = 0;
	    }

	    if (end === undefined) {
	      end = target ? target.length : 0;
	    }

	    if (thisStart === undefined) {
	      thisStart = 0;
	    }

	    if (thisEnd === undefined) {
	      thisEnd = this.length;
	    }

	    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	      throw new RangeError('out of range index');
	    }

	    if (thisStart >= thisEnd && start >= end) {
	      return 0;
	    }

	    if (thisStart >= thisEnd) {
	      return -1;
	    }

	    if (start >= end) {
	      return 1;
	    }

	    start >>>= 0;
	    end >>>= 0;
	    thisStart >>>= 0;
	    thisEnd >>>= 0;
	    if (this === target) return 0;
	    var x = thisEnd - thisStart;
	    var y = end - start;
	    var len = Math.min(x, y);
	    var thisCopy = this.slice(thisStart, thisEnd);
	    var targetCopy = target.slice(start, end);

	    for (var i = 0; i < len; ++i) {
	      if (thisCopy[i] !== targetCopy[i]) {
	        x = thisCopy[i];
	        y = targetCopy[i];
	        break;
	      }
	    }

	    if (x < y) return -1;
	    if (y < x) return 1;
	    return 0;
	  }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	  //
	  // Arguments:
	  // - buffer - a Buffer to search
	  // - val - a string, Buffer, or number
	  // - byteOffset - an index into `buffer`; will be clamped to an int32
	  // - encoding - an optional encoding, relevant is val is a string
	  // - dir - true for indexOf, false for lastIndexOf


	  function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
	    // Empty buffer means no match
	    if (buffer.length === 0) return -1; // Normalize byteOffset

	    if (typeof byteOffset === 'string') {
	      encoding = byteOffset;
	      byteOffset = 0;
	    } else if (byteOffset > 0x7fffffff) {
	      byteOffset = 0x7fffffff;
	    } else if (byteOffset < -0x80000000) {
	      byteOffset = -0x80000000;
	    }

	    byteOffset = +byteOffset; // Coerce to Number.

	    if (numberIsNaN(byteOffset)) {
	      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	      byteOffset = dir ? 0 : buffer.length - 1;
	    } // Normalize byteOffset: negative offsets start from the end of the buffer


	    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

	    if (byteOffset >= buffer.length) {
	      if (dir) return -1;else byteOffset = buffer.length - 1;
	    } else if (byteOffset < 0) {
	      if (dir) byteOffset = 0;else return -1;
	    } // Normalize val


	    if (typeof val === 'string') {
	      val = Buffer.from(val, encoding);
	    } // Finally, search either indexOf (if dir is true) or lastIndexOf


	    if (Buffer.isBuffer(val)) {
	      // Special case: looking for empty string/buffer always fails
	      if (val.length === 0) {
	        return -1;
	      }

	      return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
	    } else if (typeof val === 'number') {
	      val = val & 0xFF; // Search for a byte value [0-255]

	      if (typeof Uint8Array.prototype.indexOf === 'function') {
	        if (dir) {
	          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
	        } else {
	          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
	        }
	      }

	      return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
	    }

	    throw new TypeError('val must be string, number or Buffer');
	  }

	  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
	    var indexSize = 1;
	    var arrLength = arr.length;
	    var valLength = val.length;

	    if (encoding !== undefined) {
	      encoding = String(encoding).toLowerCase();

	      if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
	        if (arr.length < 2 || val.length < 2) {
	          return -1;
	        }

	        indexSize = 2;
	        arrLength /= 2;
	        valLength /= 2;
	        byteOffset /= 2;
	      }
	    }

	    function read(buf, i) {
	      if (indexSize === 1) {
	        return buf[i];
	      } else {
	        return buf.readUInt16BE(i * indexSize);
	      }
	    }

	    var i;

	    if (dir) {
	      var foundIndex = -1;

	      for (i = byteOffset; i < arrLength; i++) {
	        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	          if (foundIndex === -1) foundIndex = i;
	          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
	        } else {
	          if (foundIndex !== -1) i -= i - foundIndex;
	          foundIndex = -1;
	        }
	      }
	    } else {
	      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

	      for (i = byteOffset; i >= 0; i--) {
	        var found = true;

	        for (var j = 0; j < valLength; j++) {
	          if (read(arr, i + j) !== read(val, j)) {
	            found = false;
	            break;
	          }
	        }

	        if (found) return i;
	      }
	    }

	    return -1;
	  }

	  Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
	    return this.indexOf(val, byteOffset, encoding) !== -1;
	  };

	  Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
	    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
	  };

	  Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
	    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
	  };

	  function hexWrite(buf, string, offset, length) {
	    offset = Number(offset) || 0;
	    var remaining = buf.length - offset;

	    if (!length) {
	      length = remaining;
	    } else {
	      length = Number(length);

	      if (length > remaining) {
	        length = remaining;
	      }
	    }

	    var strLen = string.length;

	    if (length > strLen / 2) {
	      length = strLen / 2;
	    }

	    for (var i = 0; i < length; ++i) {
	      var parsed = parseInt(string.substr(i * 2, 2), 16);
	      if (numberIsNaN(parsed)) return i;
	      buf[offset + i] = parsed;
	    }

	    return i;
	  }

	  function utf8Write(buf, string, offset, length) {
	    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	  }

	  function asciiWrite(buf, string, offset, length) {
	    return blitBuffer(asciiToBytes(string), buf, offset, length);
	  }

	  function base64Write(buf, string, offset, length) {
	    return blitBuffer(base64ToBytes(string), buf, offset, length);
	  }

	  function ucs2Write(buf, string, offset, length) {
	    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	  }

	  Buffer.prototype.write = function write(string, offset, length, encoding) {
	    // Buffer#write(string)
	    if (offset === undefined) {
	      encoding = 'utf8';
	      length = this.length;
	      offset = 0; // Buffer#write(string, encoding)
	    } else if (length === undefined && typeof offset === 'string') {
	      encoding = offset;
	      length = this.length;
	      offset = 0; // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	      offset = offset >>> 0;

	      if (isFinite(length)) {
	        length = length >>> 0;
	        if (encoding === undefined) encoding = 'utf8';
	      } else {
	        encoding = length;
	        length = undefined;
	      }
	    } else {
	      throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
	    }

	    var remaining = this.length - offset;
	    if (length === undefined || length > remaining) length = remaining;

	    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	      throw new RangeError('Attempt to write outside buffer bounds');
	    }

	    if (!encoding) encoding = 'utf8';
	    var loweredCase = false;

	    for (;;) {
	      switch (encoding) {
	        case 'hex':
	          return hexWrite(this, string, offset, length);

	        case 'utf8':
	        case 'utf-8':
	          return utf8Write(this, string, offset, length);

	        case 'ascii':
	        case 'latin1':
	        case 'binary':
	          return asciiWrite(this, string, offset, length);

	        case 'base64':
	          // Warning: maxLength not taken into account in base64Write
	          return base64Write(this, string, offset, length);

	        case 'ucs2':
	        case 'ucs-2':
	        case 'utf16le':
	        case 'utf-16le':
	          return ucs2Write(this, string, offset, length);

	        default:
	          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	          encoding = ('' + encoding).toLowerCase();
	          loweredCase = true;
	      }
	    }
	  };

	  Buffer.prototype.toJSON = function toJSON() {
	    return {
	      type: 'Buffer',
	      data: Array.prototype.slice.call(this._arr || this, 0)
	    };
	  };

	  function base64Slice(buf, start, end) {
	    if (start === 0 && end === buf.length) {
	      return base64Js.fromByteArray(buf);
	    } else {
	      return base64Js.fromByteArray(buf.slice(start, end));
	    }
	  }

	  function utf8Slice(buf, start, end) {
	    end = Math.min(buf.length, end);
	    var res = [];
	    var i = start;

	    while (i < end) {
	      var firstByte = buf[i];
	      var codePoint = null;
	      var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	      if (i + bytesPerSequence <= end) {
	        var secondByte, thirdByte, fourthByte, tempCodePoint;

	        switch (bytesPerSequence) {
	          case 1:
	            if (firstByte < 0x80) {
	              codePoint = firstByte;
	            }

	            break;

	          case 2:
	            secondByte = buf[i + 1];

	            if ((secondByte & 0xC0) === 0x80) {
	              tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

	              if (tempCodePoint > 0x7F) {
	                codePoint = tempCodePoint;
	              }
	            }

	            break;

	          case 3:
	            secondByte = buf[i + 1];
	            thirdByte = buf[i + 2];

	            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

	              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	                codePoint = tempCodePoint;
	              }
	            }

	            break;

	          case 4:
	            secondByte = buf[i + 1];
	            thirdByte = buf[i + 2];
	            fourthByte = buf[i + 3];

	            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

	              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	                codePoint = tempCodePoint;
	              }
	            }

	        }
	      }

	      if (codePoint === null) {
	        // we did not generate a valid codePoint so insert a
	        // replacement char (U+FFFD) and advance only 1 byte
	        codePoint = 0xFFFD;
	        bytesPerSequence = 1;
	      } else if (codePoint > 0xFFFF) {
	        // encode to utf16 (surrogate pair dance)
	        codePoint -= 0x10000;
	        res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	        codePoint = 0xDC00 | codePoint & 0x3FF;
	      }

	      res.push(codePoint);
	      i += bytesPerSequence;
	    }

	    return decodeCodePointsArray(res);
	  } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
	  // the lowest limit is Chrome, with 0x10000 args.
	  // We go 1 magnitude less, for safety


	  var MAX_ARGUMENTS_LENGTH = 0x1000;

	  function decodeCodePointsArray(codePoints) {
	    var len = codePoints.length;

	    if (len <= MAX_ARGUMENTS_LENGTH) {
	      return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	    } // Decode in chunks to avoid "call stack size exceeded".


	    var res = '';
	    var i = 0;

	    while (i < len) {
	      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	    }

	    return res;
	  }

	  function asciiSlice(buf, start, end) {
	    var ret = '';
	    end = Math.min(buf.length, end);

	    for (var i = start; i < end; ++i) {
	      ret += String.fromCharCode(buf[i] & 0x7F);
	    }

	    return ret;
	  }

	  function latin1Slice(buf, start, end) {
	    var ret = '';
	    end = Math.min(buf.length, end);

	    for (var i = start; i < end; ++i) {
	      ret += String.fromCharCode(buf[i]);
	    }

	    return ret;
	  }

	  function hexSlice(buf, start, end) {
	    var len = buf.length;
	    if (!start || start < 0) start = 0;
	    if (!end || end < 0 || end > len) end = len;
	    var out = '';

	    for (var i = start; i < end; ++i) {
	      out += hexSliceLookupTable[buf[i]];
	    }

	    return out;
	  }

	  function utf16leSlice(buf, start, end) {
	    var bytes = buf.slice(start, end);
	    var res = ''; // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)

	    for (var i = 0; i < bytes.length - 1; i += 2) {
	      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	    }

	    return res;
	  }

	  Buffer.prototype.slice = function slice(start, end) {
	    var len = this.length;
	    start = ~~start;
	    end = end === undefined ? len : ~~end;

	    if (start < 0) {
	      start += len;
	      if (start < 0) start = 0;
	    } else if (start > len) {
	      start = len;
	    }

	    if (end < 0) {
	      end += len;
	      if (end < 0) end = 0;
	    } else if (end > len) {
	      end = len;
	    }

	    if (end < start) end = start;
	    var newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

	    Object.setPrototypeOf(newBuf, Buffer.prototype);
	    return newBuf;
	  };
	  /*
	   * Need to make sure that buffer isn't trying to write out of bounds.
	   */


	  function checkOffset(offset, ext, length) {
	    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	  }

	  Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	    offset = offset >>> 0;
	    byteLength = byteLength >>> 0;
	    if (!noAssert) checkOffset(offset, byteLength, this.length);
	    var val = this[offset];
	    var mul = 1;
	    var i = 0;

	    while (++i < byteLength && (mul *= 0x100)) {
	      val += this[offset + i] * mul;
	    }

	    return val;
	  };

	  Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	    offset = offset >>> 0;
	    byteLength = byteLength >>> 0;

	    if (!noAssert) {
	      checkOffset(offset, byteLength, this.length);
	    }

	    var val = this[offset + --byteLength];
	    var mul = 1;

	    while (byteLength > 0 && (mul *= 0x100)) {
	      val += this[offset + --byteLength] * mul;
	    }

	    return val;
	  };

	  Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 1, this.length);
	    return this[offset];
	  };

	  Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 2, this.length);
	    return this[offset] | this[offset + 1] << 8;
	  };

	  Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 2, this.length);
	    return this[offset] << 8 | this[offset + 1];
	  };

	  Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 4, this.length);
	    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	  };

	  Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 4, this.length);
	    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	  };

	  Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	    offset = offset >>> 0;
	    byteLength = byteLength >>> 0;
	    if (!noAssert) checkOffset(offset, byteLength, this.length);
	    var val = this[offset];
	    var mul = 1;
	    var i = 0;

	    while (++i < byteLength && (mul *= 0x100)) {
	      val += this[offset + i] * mul;
	    }

	    mul *= 0x80;
	    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
	    return val;
	  };

	  Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	    offset = offset >>> 0;
	    byteLength = byteLength >>> 0;
	    if (!noAssert) checkOffset(offset, byteLength, this.length);
	    var i = byteLength;
	    var mul = 1;
	    var val = this[offset + --i];

	    while (i > 0 && (mul *= 0x100)) {
	      val += this[offset + --i] * mul;
	    }

	    mul *= 0x80;
	    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
	    return val;
	  };

	  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 1, this.length);
	    if (!(this[offset] & 0x80)) return this[offset];
	    return (0xff - this[offset] + 1) * -1;
	  };

	  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 2, this.length);
	    var val = this[offset] | this[offset + 1] << 8;
	    return val & 0x8000 ? val | 0xFFFF0000 : val;
	  };

	  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 2, this.length);
	    var val = this[offset + 1] | this[offset] << 8;
	    return val & 0x8000 ? val | 0xFFFF0000 : val;
	  };

	  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 4, this.length);
	    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	  };

	  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 4, this.length);
	    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	  };

	  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 4, this.length);
	    return ieee754.read(this, offset, true, 23, 4);
	  };

	  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 4, this.length);
	    return ieee754.read(this, offset, false, 23, 4);
	  };

	  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 8, this.length);
	    return ieee754.read(this, offset, true, 52, 8);
	  };

	  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	    offset = offset >>> 0;
	    if (!noAssert) checkOffset(offset, 8, this.length);
	    return ieee754.read(this, offset, false, 52, 8);
	  };

	  function checkInt(buf, value, offset, ext, max, min) {
	    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
	    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
	    if (offset + ext > buf.length) throw new RangeError('Index out of range');
	  }

	  Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    byteLength = byteLength >>> 0;

	    if (!noAssert) {
	      var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	      checkInt(this, value, offset, byteLength, maxBytes, 0);
	    }

	    var mul = 1;
	    var i = 0;
	    this[offset] = value & 0xFF;

	    while (++i < byteLength && (mul *= 0x100)) {
	      this[offset + i] = value / mul & 0xFF;
	    }

	    return offset + byteLength;
	  };

	  Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    byteLength = byteLength >>> 0;

	    if (!noAssert) {
	      var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	      checkInt(this, value, offset, byteLength, maxBytes, 0);
	    }

	    var i = byteLength - 1;
	    var mul = 1;
	    this[offset + i] = value & 0xFF;

	    while (--i >= 0 && (mul *= 0x100)) {
	      this[offset + i] = value / mul & 0xFF;
	    }

	    return offset + byteLength;
	  };

	  Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	    this[offset] = value & 0xff;
	    return offset + 1;
	  };

	  Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    return offset + 2;
	  };

	  Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	    return offset + 2;
	  };

	  Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	    return offset + 4;
	  };

	  Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	    return offset + 4;
	  };

	  Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	    value = +value;
	    offset = offset >>> 0;

	    if (!noAssert) {
	      var limit = Math.pow(2, 8 * byteLength - 1);
	      checkInt(this, value, offset, byteLength, limit - 1, -limit);
	    }

	    var i = 0;
	    var mul = 1;
	    var sub = 0;
	    this[offset] = value & 0xFF;

	    while (++i < byteLength && (mul *= 0x100)) {
	      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	        sub = 1;
	      }

	      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	    }

	    return offset + byteLength;
	  };

	  Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	    value = +value;
	    offset = offset >>> 0;

	    if (!noAssert) {
	      var limit = Math.pow(2, 8 * byteLength - 1);
	      checkInt(this, value, offset, byteLength, limit - 1, -limit);
	    }

	    var i = byteLength - 1;
	    var mul = 1;
	    var sub = 0;
	    this[offset + i] = value & 0xFF;

	    while (--i >= 0 && (mul *= 0x100)) {
	      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	        sub = 1;
	      }

	      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	    }

	    return offset + byteLength;
	  };

	  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	    if (value < 0) value = 0xff + value + 1;
	    this[offset] = value & 0xff;
	    return offset + 1;
	  };

	  Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    return offset + 2;
	  };

	  Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	    return offset + 2;
	  };

	  Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	    return offset + 4;
	  };

	  Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	    value = +value;
	    offset = offset >>> 0;
	    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	    if (value < 0) value = 0xffffffff + value + 1;
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	    return offset + 4;
	  };

	  function checkIEEE754(buf, value, offset, ext, max, min) {
	    if (offset + ext > buf.length) throw new RangeError('Index out of range');
	    if (offset < 0) throw new RangeError('Index out of range');
	  }

	  function writeFloat(buf, value, offset, littleEndian, noAssert) {
	    value = +value;
	    offset = offset >>> 0;

	    if (!noAssert) {
	      checkIEEE754(buf, value, offset, 4);
	    }

	    ieee754.write(buf, value, offset, littleEndian, 23, 4);
	    return offset + 4;
	  }

	  Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	    return writeFloat(this, value, offset, true, noAssert);
	  };

	  Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	    return writeFloat(this, value, offset, false, noAssert);
	  };

	  function writeDouble(buf, value, offset, littleEndian, noAssert) {
	    value = +value;
	    offset = offset >>> 0;

	    if (!noAssert) {
	      checkIEEE754(buf, value, offset, 8);
	    }

	    ieee754.write(buf, value, offset, littleEndian, 52, 8);
	    return offset + 8;
	  }

	  Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	    return writeDouble(this, value, offset, true, noAssert);
	  };

	  Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	    return writeDouble(this, value, offset, false, noAssert);
	  }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


	  Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
	    if (!start) start = 0;
	    if (!end && end !== 0) end = this.length;
	    if (targetStart >= target.length) targetStart = target.length;
	    if (!targetStart) targetStart = 0;
	    if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

	    if (end === start) return 0;
	    if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

	    if (targetStart < 0) {
	      throw new RangeError('targetStart out of bounds');
	    }

	    if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
	    if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

	    if (end > this.length) end = this.length;

	    if (target.length - targetStart < end - start) {
	      end = target.length - targetStart + start;
	    }

	    var len = end - start;

	    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
	      // Use built-in when available, missing from IE11
	      this.copyWithin(targetStart, start, end);
	    } else {
	      Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
	    }

	    return len;
	  }; // Usage:
	  //    buffer.fill(number[, offset[, end]])
	  //    buffer.fill(buffer[, offset[, end]])
	  //    buffer.fill(string[, offset[, end]][, encoding])


	  Buffer.prototype.fill = function fill(val, start, end, encoding) {
	    // Handle string cases:
	    if (typeof val === 'string') {
	      if (typeof start === 'string') {
	        encoding = start;
	        start = 0;
	        end = this.length;
	      } else if (typeof end === 'string') {
	        encoding = end;
	        end = this.length;
	      }

	      if (encoding !== undefined && typeof encoding !== 'string') {
	        throw new TypeError('encoding must be a string');
	      }

	      if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	        throw new TypeError('Unknown encoding: ' + encoding);
	      }

	      if (val.length === 1) {
	        var code = val.charCodeAt(0);

	        if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
	          // Fast path: If `val` fits into a single byte, use that numeric value.
	          val = code;
	        }
	      }
	    } else if (typeof val === 'number') {
	      val = val & 255;
	    } else if (typeof val === 'boolean') {
	      val = Number(val);
	    } // Invalid ranges are not set to a default, so can range check early.


	    if (start < 0 || this.length < start || this.length < end) {
	      throw new RangeError('Out of range index');
	    }

	    if (end <= start) {
	      return this;
	    }

	    start = start >>> 0;
	    end = end === undefined ? this.length : end >>> 0;
	    if (!val) val = 0;
	    var i;

	    if (typeof val === 'number') {
	      for (i = start; i < end; ++i) {
	        this[i] = val;
	      }
	    } else {
	      var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
	      var len = bytes.length;

	      if (len === 0) {
	        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
	      }

	      for (i = 0; i < end - start; ++i) {
	        this[i + start] = bytes[i % len];
	      }
	    }

	    return this;
	  }; // HELPER FUNCTIONS
	  // ================


	  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

	  function base64clean(str) {
	    // Node takes equal signs as end of the Base64 encoding
	    str = str.split('=')[0]; // Node strips out invalid characters like \n and \t from the string, base64-js does not

	    str = str.trim().replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

	    if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

	    while (str.length % 4 !== 0) {
	      str = str + '=';
	    }

	    return str;
	  }

	  function utf8ToBytes(string, units) {
	    units = units || Infinity;
	    var codePoint;
	    var length = string.length;
	    var leadSurrogate = null;
	    var bytes = [];

	    for (var i = 0; i < length; ++i) {
	      codePoint = string.charCodeAt(i); // is surrogate component

	      if (codePoint > 0xD7FF && codePoint < 0xE000) {
	        // last char was a lead
	        if (!leadSurrogate) {
	          // no lead yet
	          if (codePoint > 0xDBFF) {
	            // unexpected trail
	            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	            continue;
	          } else if (i + 1 === length) {
	            // unpaired lead
	            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	            continue;
	          } // valid lead


	          leadSurrogate = codePoint;
	          continue;
	        } // 2 leads in a row


	        if (codePoint < 0xDC00) {
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          leadSurrogate = codePoint;
	          continue;
	        } // valid surrogate pair


	        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	      } else if (leadSurrogate) {
	        // valid bmp char, but last char was a lead
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	      }

	      leadSurrogate = null; // encode utf8

	      if (codePoint < 0x80) {
	        if ((units -= 1) < 0) break;
	        bytes.push(codePoint);
	      } else if (codePoint < 0x800) {
	        if ((units -= 2) < 0) break;
	        bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	      } else if (codePoint < 0x10000) {
	        if ((units -= 3) < 0) break;
	        bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	      } else if (codePoint < 0x110000) {
	        if ((units -= 4) < 0) break;
	        bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	      } else {
	        throw new Error('Invalid code point');
	      }
	    }

	    return bytes;
	  }

	  function asciiToBytes(str) {
	    var byteArray = [];

	    for (var i = 0; i < str.length; ++i) {
	      // Node's code seems to be doing this and not & 0x7F..
	      byteArray.push(str.charCodeAt(i) & 0xFF);
	    }

	    return byteArray;
	  }

	  function utf16leToBytes(str, units) {
	    var c, hi, lo;
	    var byteArray = [];

	    for (var i = 0; i < str.length; ++i) {
	      if ((units -= 2) < 0) break;
	      c = str.charCodeAt(i);
	      hi = c >> 8;
	      lo = c % 256;
	      byteArray.push(lo);
	      byteArray.push(hi);
	    }

	    return byteArray;
	  }

	  function base64ToBytes(str) {
	    return base64Js.toByteArray(base64clean(str));
	  }

	  function blitBuffer(src, dst, offset, length) {
	    for (var i = 0; i < length; ++i) {
	      if (i + offset >= dst.length || i >= src.length) break;
	      dst[i + offset] = src[i];
	    }

	    return i;
	  } // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
	  // the `instanceof` check but they should be treated as of that type.
	  // See: https://github.com/feross/buffer/issues/166


	  function isInstance(obj, type) {
	    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
	  }

	  function numberIsNaN(obj) {
	    // For IE11 support
	    return obj !== obj; // eslint-disable-line no-self-compare
	  } // Create lookup table for `toString('hex')`
	  // See: https://github.com/feross/buffer/issues/219


	  var hexSliceLookupTable = function () {
	    var alphabet = '0123456789abcdef';
	    var table = new Array(256);

	    for (var i = 0; i < 16; ++i) {
	      var i16 = i * 16;

	      for (var j = 0; j < 16; ++j) {
	        table[i16 + j] = alphabet[i] + alphabet[j];
	      }
	    }

	    return table;
	  }();
	});
	var buffer_1 = buffer$1.Buffer;
	buffer$1.SlowBuffer;
	buffer$1.INSPECT_MAX_BYTES;
	buffer$1.kMaxLength;

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

	/* global Reflect, Promise */
	var _extendStatics = function extendStatics(d, b) {
	  _extendStatics = Object.setPrototypeOf || {
	    __proto__: []
	  } instanceof Array && function (d, b) {
	    d.__proto__ = b;
	  } || function (d, b) {
	    for (var p in b) {
	      if (b.hasOwnProperty(p)) d[p] = b[p];
	    }
	  };

	  return _extendStatics(d, b);
	};

	function __extends(d, b) {
	  _extendStatics(d, b);

	  function __() {
	    this.constructor = d;
	  }

	  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var _assign = function __assign() {
	  _assign = Object.assign || function __assign(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	      s = arguments[i];

	      for (var p in s) {
	        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	      }
	    }

	    return t;
	  };

	  return _assign.apply(this, arguments);
	};

	/** @public */
	var BSONError = /** @class */ (function (_super) {
	    __extends(BSONError, _super);
	    function BSONError(message) {
	        var _this = _super.call(this, message) || this;
	        Object.setPrototypeOf(_this, BSONError.prototype);
	        return _this;
	    }
	    Object.defineProperty(BSONError.prototype, "name", {
	        get: function () {
	            return 'BSONError';
	        },
	        enumerable: false,
	        configurable: true
	    });
	    return BSONError;
	}(Error));
	/** @public */
	var BSONTypeError = /** @class */ (function (_super) {
	    __extends(BSONTypeError, _super);
	    function BSONTypeError(message) {
	        var _this = _super.call(this, message) || this;
	        Object.setPrototypeOf(_this, BSONTypeError.prototype);
	        return _this;
	    }
	    Object.defineProperty(BSONTypeError.prototype, "name", {
	        get: function () {
	            return 'BSONTypeError';
	        },
	        enumerable: false,
	        configurable: true
	    });
	    return BSONTypeError;
	}(TypeError));

	function checkForMath(potentialGlobal) {
	    // eslint-disable-next-line eqeqeq
	    return potentialGlobal && potentialGlobal.Math == Math && potentialGlobal;
	}
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	function getGlobal() {
	    return (checkForMath(typeof globalThis === 'object' && globalThis) ||
	        checkForMath(typeof window === 'object' && window) ||
	        checkForMath(typeof self === 'object' && self) ||
	        checkForMath(typeof global === 'object' && global) ||
	        // eslint-disable-next-line @typescript-eslint/no-implied-eval
	        Function('return this')());
	}

	/**
	 * Normalizes our expected stringified form of a function across versions of node
	 * @param fn - The function to stringify
	 */
	function normalizedFunctionString(fn) {
	    return fn.toString().replace('function(', 'function (');
	}
	function isReactNative() {
	    var g = getGlobal();
	    return typeof g.navigator === 'object' && g.navigator.product === 'ReactNative';
	}
	var insecureRandomBytes = function insecureRandomBytes(size) {
	    var insecureWarning = isReactNative()
	        ? 'BSON: For React Native please polyfill crypto.getRandomValues, e.g. using: https://www.npmjs.com/package/react-native-get-random-values.'
	        : 'BSON: No cryptographic implementation for random bytes present, falling back to a less secure implementation.';
	    console.warn(insecureWarning);
	    var result = buffer_1.alloc(size);
	    for (var i = 0; i < size; ++i)
	        result[i] = Math.floor(Math.random() * 256);
	    return result;
	};
	var detectRandomBytes = function () {
	    {
	        if (typeof window !== 'undefined') {
	            // browser crypto implementation(s)
	            var target_1 = window.crypto || window.msCrypto; // allow for IE11
	            if (target_1 && target_1.getRandomValues) {
	                return function (size) { return target_1.getRandomValues(buffer_1.alloc(size)); };
	            }
	        }
	        if (typeof global !== 'undefined' && global.crypto && global.crypto.getRandomValues) {
	            // allow for RN packages such as https://www.npmjs.com/package/react-native-get-random-values to populate global
	            return function (size) { return global.crypto.getRandomValues(buffer_1.alloc(size)); };
	        }
	        return insecureRandomBytes;
	    }
	};
	var randomBytes = detectRandomBytes();
	function isAnyArrayBuffer(value) {
	    return ['[object ArrayBuffer]', '[object SharedArrayBuffer]'].includes(Object.prototype.toString.call(value));
	}
	function isUint8Array(value) {
	    return Object.prototype.toString.call(value) === '[object Uint8Array]';
	}
	function isBigInt64Array(value) {
	    return Object.prototype.toString.call(value) === '[object BigInt64Array]';
	}
	function isBigUInt64Array(value) {
	    return Object.prototype.toString.call(value) === '[object BigUint64Array]';
	}
	function isRegExp(d) {
	    return Object.prototype.toString.call(d) === '[object RegExp]';
	}
	function isMap(d) {
	    return Object.prototype.toString.call(d) === '[object Map]';
	}
	// To ensure that 0.4 of node works correctly
	function isDate(d) {
	    return isObjectLike(d) && Object.prototype.toString.call(d) === '[object Date]';
	}
	/**
	 * @internal
	 * this is to solve the `'someKey' in x` problem where x is unknown.
	 * https://github.com/typescript-eslint/typescript-eslint/issues/1071#issuecomment-541955753
	 */
	function isObjectLike(candidate) {
	    return typeof candidate === 'object' && candidate !== null;
	}
	function deprecate(fn, message) {
	    var warned = false;
	    function deprecated() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (!warned) {
	            console.warn(message);
	            warned = true;
	        }
	        return fn.apply(this, args);
	    }
	    return deprecated;
	}

	/**
	 * Makes sure that, if a Uint8Array is passed in, it is wrapped in a Buffer.
	 *
	 * @param potentialBuffer - The potential buffer
	 * @returns Buffer the input if potentialBuffer is a buffer, or a buffer that
	 * wraps a passed in Uint8Array
	 * @throws BSONTypeError If anything other than a Buffer or Uint8Array is passed in
	 */
	function ensureBuffer(potentialBuffer) {
	    if (ArrayBuffer.isView(potentialBuffer)) {
	        return buffer_1.from(potentialBuffer.buffer, potentialBuffer.byteOffset, potentialBuffer.byteLength);
	    }
	    if (isAnyArrayBuffer(potentialBuffer)) {
	        return buffer_1.from(potentialBuffer);
	    }
	    throw new BSONTypeError('Must use either Buffer or TypedArray');
	}

	// Validation regex for v4 uuid (validates with or without dashes)
	var VALIDATION_REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15})$/i;
	var uuidValidateString = function (str) {
	    return typeof str === 'string' && VALIDATION_REGEX.test(str);
	};
	var uuidHexStringToBuffer = function (hexString) {
	    if (!uuidValidateString(hexString)) {
	        throw new BSONTypeError('UUID string representations must be a 32 or 36 character hex string (dashes excluded/included). Format: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" or "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".');
	    }
	    var sanitizedHexString = hexString.replace(/-/g, '');
	    return buffer_1.from(sanitizedHexString, 'hex');
	};
	var bufferToUuidHexString = function (buffer, includeDashes) {
	    if (includeDashes === void 0) { includeDashes = true; }
	    return includeDashes
	        ? buffer.toString('hex', 0, 4) +
	            '-' +
	            buffer.toString('hex', 4, 6) +
	            '-' +
	            buffer.toString('hex', 6, 8) +
	            '-' +
	            buffer.toString('hex', 8, 10) +
	            '-' +
	            buffer.toString('hex', 10, 16)
	        : buffer.toString('hex');
	};

	/** @internal */
	var BSON_INT32_MAX$1 = 0x7fffffff;
	/** @internal */
	var BSON_INT32_MIN$1 = -0x80000000;
	/** @internal */
	var BSON_INT64_MAX$1 = Math.pow(2, 63) - 1;
	/** @internal */
	var BSON_INT64_MIN$1 = -Math.pow(2, 63);
	/**
	 * Any integer up to 2^53 can be precisely represented by a double.
	 * @internal
	 */
	var JS_INT_MAX = Math.pow(2, 53);
	/**
	 * Any integer down to -2^53 can be precisely represented by a double.
	 * @internal
	 */
	var JS_INT_MIN = -Math.pow(2, 53);
	/** Number BSON Type @internal */
	var BSON_DATA_NUMBER = 1;
	/** String BSON Type @internal */
	var BSON_DATA_STRING = 2;
	/** Object BSON Type @internal */
	var BSON_DATA_OBJECT = 3;
	/** Array BSON Type @internal */
	var BSON_DATA_ARRAY = 4;
	/** Binary BSON Type @internal */
	var BSON_DATA_BINARY = 5;
	/** Binary BSON Type @internal */
	var BSON_DATA_UNDEFINED = 6;
	/** ObjectId BSON Type @internal */
	var BSON_DATA_OID = 7;
	/** Boolean BSON Type @internal */
	var BSON_DATA_BOOLEAN = 8;
	/** Date BSON Type @internal */
	var BSON_DATA_DATE = 9;
	/** null BSON Type @internal */
	var BSON_DATA_NULL = 10;
	/** RegExp BSON Type @internal */
	var BSON_DATA_REGEXP = 11;
	/** Code BSON Type @internal */
	var BSON_DATA_DBPOINTER = 12;
	/** Code BSON Type @internal */
	var BSON_DATA_CODE = 13;
	/** Symbol BSON Type @internal */
	var BSON_DATA_SYMBOL = 14;
	/** Code with Scope BSON Type @internal */
	var BSON_DATA_CODE_W_SCOPE = 15;
	/** 32 bit Integer BSON Type @internal */
	var BSON_DATA_INT = 16;
	/** Timestamp BSON Type @internal */
	var BSON_DATA_TIMESTAMP = 17;
	/** Long BSON Type @internal */
	var BSON_DATA_LONG = 18;
	/** Decimal128 BSON Type @internal */
	var BSON_DATA_DECIMAL128 = 19;
	/** MinKey BSON Type @internal */
	var BSON_DATA_MIN_KEY = 0xff;
	/** MaxKey BSON Type @internal */
	var BSON_DATA_MAX_KEY = 0x7f;
	/** Binary Default Type @internal */
	var BSON_BINARY_SUBTYPE_DEFAULT = 0;
	/** Binary Function Type @internal */
	var BSON_BINARY_SUBTYPE_FUNCTION = 1;
	/** Binary Byte Array Type @internal */
	var BSON_BINARY_SUBTYPE_BYTE_ARRAY = 2;
	/** Binary Deprecated UUID Type @deprecated Please use BSON_BINARY_SUBTYPE_UUID_NEW @internal */
	var BSON_BINARY_SUBTYPE_UUID = 3;
	/** Binary UUID Type @internal */
	var BSON_BINARY_SUBTYPE_UUID_NEW = 4;
	/** Binary MD5 Type @internal */
	var BSON_BINARY_SUBTYPE_MD5 = 5;
	/** Encrypted BSON type @internal */
	var BSON_BINARY_SUBTYPE_ENCRYPTED = 6;
	/** Column BSON type @internal */
	var BSON_BINARY_SUBTYPE_COLUMN = 7;
	/** Binary User Defined Type @internal */
	var BSON_BINARY_SUBTYPE_USER_DEFINED = 128;

	/**
	 * A class representation of the BSON Binary type.
	 * @public
	 * @category BSONType
	 */
	var Binary = /** @class */ (function () {
	    /**
	     * Create a new Binary instance.
	     *
	     * This constructor can accept a string as its first argument. In this case,
	     * this string will be encoded using ISO-8859-1, **not** using UTF-8.
	     * This is almost certainly not what you want. Use `new Binary(Buffer.from(string))`
	     * instead to convert the string to a Buffer using UTF-8 first.
	     *
	     * @param buffer - a buffer object containing the binary data.
	     * @param subType - the option binary type.
	     */
	    function Binary(buffer, subType) {
	        if (!(this instanceof Binary))
	            return new Binary(buffer, subType);
	        if (!(buffer == null) &&
	            !(typeof buffer === 'string') &&
	            !ArrayBuffer.isView(buffer) &&
	            !(buffer instanceof ArrayBuffer) &&
	            !Array.isArray(buffer)) {
	            throw new BSONTypeError('Binary can only be constructed from string, Buffer, TypedArray, or Array<number>');
	        }
	        this.sub_type = subType !== null && subType !== void 0 ? subType : Binary.BSON_BINARY_SUBTYPE_DEFAULT;
	        if (buffer == null) {
	            // create an empty binary buffer
	            this.buffer = buffer_1.alloc(Binary.BUFFER_SIZE);
	            this.position = 0;
	        }
	        else {
	            if (typeof buffer === 'string') {
	                // string
	                this.buffer = buffer_1.from(buffer, 'binary');
	            }
	            else if (Array.isArray(buffer)) {
	                // number[]
	                this.buffer = buffer_1.from(buffer);
	            }
	            else {
	                // Buffer | TypedArray | ArrayBuffer
	                this.buffer = ensureBuffer(buffer);
	            }
	            this.position = this.buffer.byteLength;
	        }
	    }
	    /**
	     * Updates this binary with byte_value.
	     *
	     * @param byteValue - a single byte we wish to write.
	     */
	    Binary.prototype.put = function (byteValue) {
	        // If it's a string and a has more than one character throw an error
	        if (typeof byteValue === 'string' && byteValue.length !== 1) {
	            throw new BSONTypeError('only accepts single character String');
	        }
	        else if (typeof byteValue !== 'number' && byteValue.length !== 1)
	            throw new BSONTypeError('only accepts single character Uint8Array or Array');
	        // Decode the byte value once
	        var decodedByte;
	        if (typeof byteValue === 'string') {
	            decodedByte = byteValue.charCodeAt(0);
	        }
	        else if (typeof byteValue === 'number') {
	            decodedByte = byteValue;
	        }
	        else {
	            decodedByte = byteValue[0];
	        }
	        if (decodedByte < 0 || decodedByte > 255) {
	            throw new BSONTypeError('only accepts number in a valid unsigned byte range 0-255');
	        }
	        if (this.buffer.length > this.position) {
	            this.buffer[this.position++] = decodedByte;
	        }
	        else {
	            var buffer = buffer_1.alloc(Binary.BUFFER_SIZE + this.buffer.length);
	            // Combine the two buffers together
	            this.buffer.copy(buffer, 0, 0, this.buffer.length);
	            this.buffer = buffer;
	            this.buffer[this.position++] = decodedByte;
	        }
	    };
	    /**
	     * Writes a buffer or string to the binary.
	     *
	     * @param sequence - a string or buffer to be written to the Binary BSON object.
	     * @param offset - specify the binary of where to write the content.
	     */
	    Binary.prototype.write = function (sequence, offset) {
	        offset = typeof offset === 'number' ? offset : this.position;
	        // If the buffer is to small let's extend the buffer
	        if (this.buffer.length < offset + sequence.length) {
	            var buffer = buffer_1.alloc(this.buffer.length + sequence.length);
	            this.buffer.copy(buffer, 0, 0, this.buffer.length);
	            // Assign the new buffer
	            this.buffer = buffer;
	        }
	        if (ArrayBuffer.isView(sequence)) {
	            this.buffer.set(ensureBuffer(sequence), offset);
	            this.position =
	                offset + sequence.byteLength > this.position ? offset + sequence.length : this.position;
	        }
	        else if (typeof sequence === 'string') {
	            this.buffer.write(sequence, offset, sequence.length, 'binary');
	            this.position =
	                offset + sequence.length > this.position ? offset + sequence.length : this.position;
	        }
	    };
	    /**
	     * Reads **length** bytes starting at **position**.
	     *
	     * @param position - read from the given position in the Binary.
	     * @param length - the number of bytes to read.
	     */
	    Binary.prototype.read = function (position, length) {
	        length = length && length > 0 ? length : this.position;
	        // Let's return the data based on the type we have
	        return this.buffer.slice(position, position + length);
	    };
	    /**
	     * Returns the value of this binary as a string.
	     * @param asRaw - Will skip converting to a string
	     * @remarks
	     * This is handy when calling this function conditionally for some key value pairs and not others
	     */
	    Binary.prototype.value = function (asRaw) {
	        asRaw = !!asRaw;
	        // Optimize to serialize for the situation where the data == size of buffer
	        if (asRaw && this.buffer.length === this.position) {
	            return this.buffer;
	        }
	        // If it's a node.js buffer object
	        if (asRaw) {
	            return this.buffer.slice(0, this.position);
	        }
	        return this.buffer.toString('binary', 0, this.position);
	    };
	    /** the length of the binary sequence */
	    Binary.prototype.length = function () {
	        return this.position;
	    };
	    Binary.prototype.toJSON = function () {
	        return this.buffer.toString('base64');
	    };
	    Binary.prototype.toString = function (format) {
	        return this.buffer.toString(format);
	    };
	    /** @internal */
	    Binary.prototype.toExtendedJSON = function (options) {
	        options = options || {};
	        var base64String = this.buffer.toString('base64');
	        var subType = Number(this.sub_type).toString(16);
	        if (options.legacy) {
	            return {
	                $binary: base64String,
	                $type: subType.length === 1 ? '0' + subType : subType
	            };
	        }
	        return {
	            $binary: {
	                base64: base64String,
	                subType: subType.length === 1 ? '0' + subType : subType
	            }
	        };
	    };
	    Binary.prototype.toUUID = function () {
	        if (this.sub_type === Binary.SUBTYPE_UUID) {
	            return new UUID(this.buffer.slice(0, this.position));
	        }
	        throw new BSONError("Binary sub_type \"".concat(this.sub_type, "\" is not supported for converting to UUID. Only \"").concat(Binary.SUBTYPE_UUID, "\" is currently supported."));
	    };
	    /** @internal */
	    Binary.fromExtendedJSON = function (doc, options) {
	        options = options || {};
	        var data;
	        var type;
	        if ('$binary' in doc) {
	            if (options.legacy && typeof doc.$binary === 'string' && '$type' in doc) {
	                type = doc.$type ? parseInt(doc.$type, 16) : 0;
	                data = buffer_1.from(doc.$binary, 'base64');
	            }
	            else {
	                if (typeof doc.$binary !== 'string') {
	                    type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
	                    data = buffer_1.from(doc.$binary.base64, 'base64');
	                }
	            }
	        }
	        else if ('$uuid' in doc) {
	            type = 4;
	            data = uuidHexStringToBuffer(doc.$uuid);
	        }
	        if (!data) {
	            throw new BSONTypeError("Unexpected Binary Extended JSON format ".concat(JSON.stringify(doc)));
	        }
	        return type === BSON_BINARY_SUBTYPE_UUID_NEW ? new UUID(data) : new Binary(data, type);
	    };
	    /** @internal */
	    Binary.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Binary.prototype.inspect = function () {
	        var asBuffer = this.value(true);
	        return "new Binary(Buffer.from(\"".concat(asBuffer.toString('hex'), "\", \"hex\"), ").concat(this.sub_type, ")");
	    };
	    /**
	     * Binary default subtype
	     * @internal
	     */
	    Binary.BSON_BINARY_SUBTYPE_DEFAULT = 0;
	    /** Initial buffer default size */
	    Binary.BUFFER_SIZE = 256;
	    /** Default BSON type */
	    Binary.SUBTYPE_DEFAULT = 0;
	    /** Function BSON type */
	    Binary.SUBTYPE_FUNCTION = 1;
	    /** Byte Array BSON type */
	    Binary.SUBTYPE_BYTE_ARRAY = 2;
	    /** Deprecated UUID BSON type @deprecated Please use SUBTYPE_UUID */
	    Binary.SUBTYPE_UUID_OLD = 3;
	    /** UUID BSON type */
	    Binary.SUBTYPE_UUID = 4;
	    /** MD5 BSON type */
	    Binary.SUBTYPE_MD5 = 5;
	    /** Encrypted BSON type */
	    Binary.SUBTYPE_ENCRYPTED = 6;
	    /** Column BSON type */
	    Binary.SUBTYPE_COLUMN = 7;
	    /** User BSON type */
	    Binary.SUBTYPE_USER_DEFINED = 128;
	    return Binary;
	}());
	Object.defineProperty(Binary.prototype, '_bsontype', { value: 'Binary' });
	var UUID_BYTE_LENGTH = 16;
	/**
	 * A class representation of the BSON UUID type.
	 * @public
	 */
	var UUID = /** @class */ (function (_super) {
	    __extends(UUID, _super);
	    /**
	     * Create an UUID type
	     *
	     * @param input - Can be a 32 or 36 character hex string (dashes excluded/included) or a 16 byte binary Buffer.
	     */
	    function UUID(input) {
	        var _this = this;
	        var bytes;
	        var hexStr;
	        if (input == null) {
	            bytes = UUID.generate();
	        }
	        else if (input instanceof UUID) {
	            bytes = buffer_1.from(input.buffer);
	            hexStr = input.__id;
	        }
	        else if (ArrayBuffer.isView(input) && input.byteLength === UUID_BYTE_LENGTH) {
	            bytes = ensureBuffer(input);
	        }
	        else if (typeof input === 'string') {
	            bytes = uuidHexStringToBuffer(input);
	        }
	        else {
	            throw new BSONTypeError('Argument passed in UUID constructor must be a UUID, a 16 byte Buffer or a 32/36 character hex string (dashes excluded/included, format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).');
	        }
	        _this = _super.call(this, bytes, BSON_BINARY_SUBTYPE_UUID_NEW) || this;
	        _this.__id = hexStr;
	        return _this;
	    }
	    Object.defineProperty(UUID.prototype, "id", {
	        /**
	         * The UUID bytes
	         * @readonly
	         */
	        get: function () {
	            return this.buffer;
	        },
	        set: function (value) {
	            this.buffer = value;
	            if (UUID.cacheHexString) {
	                this.__id = bufferToUuidHexString(value);
	            }
	        },
	        enumerable: false,
	        configurable: true
	    });
	    /**
	     * Returns the UUID id as a 32 or 36 character hex string representation, excluding/including dashes (defaults to 36 character dash separated)
	     * @param includeDashes - should the string exclude dash-separators.
	     * */
	    UUID.prototype.toHexString = function (includeDashes) {
	        if (includeDashes === void 0) { includeDashes = true; }
	        if (UUID.cacheHexString && this.__id) {
	            return this.__id;
	        }
	        var uuidHexString = bufferToUuidHexString(this.id, includeDashes);
	        if (UUID.cacheHexString) {
	            this.__id = uuidHexString;
	        }
	        return uuidHexString;
	    };
	    /**
	     * Converts the id into a 36 character (dashes included) hex string, unless a encoding is specified.
	     */
	    UUID.prototype.toString = function (encoding) {
	        return encoding ? this.id.toString(encoding) : this.toHexString();
	    };
	    /**
	     * Converts the id into its JSON string representation.
	     * A 36 character (dashes included) hex string in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	     */
	    UUID.prototype.toJSON = function () {
	        return this.toHexString();
	    };
	    /**
	     * Compares the equality of this UUID with `otherID`.
	     *
	     * @param otherId - UUID instance to compare against.
	     */
	    UUID.prototype.equals = function (otherId) {
	        if (!otherId) {
	            return false;
	        }
	        if (otherId instanceof UUID) {
	            return otherId.id.equals(this.id);
	        }
	        try {
	            return new UUID(otherId).id.equals(this.id);
	        }
	        catch (_a) {
	            return false;
	        }
	    };
	    /**
	     * Creates a Binary instance from the current UUID.
	     */
	    UUID.prototype.toBinary = function () {
	        return new Binary(this.id, Binary.SUBTYPE_UUID);
	    };
	    /**
	     * Generates a populated buffer containing a v4 uuid
	     */
	    UUID.generate = function () {
	        var bytes = randomBytes(UUID_BYTE_LENGTH);
	        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	        // Kindly borrowed from https://github.com/uuidjs/uuid/blob/master/src/v4.js
	        bytes[6] = (bytes[6] & 0x0f) | 0x40;
	        bytes[8] = (bytes[8] & 0x3f) | 0x80;
	        return buffer_1.from(bytes);
	    };
	    /**
	     * Checks if a value is a valid bson UUID
	     * @param input - UUID, string or Buffer to validate.
	     */
	    UUID.isValid = function (input) {
	        if (!input) {
	            return false;
	        }
	        if (input instanceof UUID) {
	            return true;
	        }
	        if (typeof input === 'string') {
	            return uuidValidateString(input);
	        }
	        if (isUint8Array(input)) {
	            // check for length & uuid version (https://tools.ietf.org/html/rfc4122#section-4.1.3)
	            if (input.length !== UUID_BYTE_LENGTH) {
	                return false;
	            }
	            return (input[6] & 0xf0) === 0x40 && (input[8] & 0x80) === 0x80;
	        }
	        return false;
	    };
	    /**
	     * Creates an UUID from a hex string representation of an UUID.
	     * @param hexString - 32 or 36 character hex string (dashes excluded/included).
	     */
	    UUID.createFromHexString = function (hexString) {
	        var buffer = uuidHexStringToBuffer(hexString);
	        return new UUID(buffer);
	    };
	    /**
	     * Converts to a string representation of this Id.
	     *
	     * @returns return the 36 character hex string representation.
	     * @internal
	     */
	    UUID.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    UUID.prototype.inspect = function () {
	        return "new UUID(\"".concat(this.toHexString(), "\")");
	    };
	    return UUID;
	}(Binary));

	/**
	 * A class representation of the BSON Code type.
	 * @public
	 * @category BSONType
	 */
	var Code = /** @class */ (function () {
	    /**
	     * @param code - a string or function.
	     * @param scope - an optional scope for the function.
	     */
	    function Code(code, scope) {
	        if (!(this instanceof Code))
	            return new Code(code, scope);
	        this.code = code;
	        this.scope = scope;
	    }
	    Code.prototype.toJSON = function () {
	        return { code: this.code, scope: this.scope };
	    };
	    /** @internal */
	    Code.prototype.toExtendedJSON = function () {
	        if (this.scope) {
	            return { $code: this.code, $scope: this.scope };
	        }
	        return { $code: this.code };
	    };
	    /** @internal */
	    Code.fromExtendedJSON = function (doc) {
	        return new Code(doc.$code, doc.$scope);
	    };
	    /** @internal */
	    Code.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Code.prototype.inspect = function () {
	        var codeJson = this.toJSON();
	        return "new Code(\"".concat(String(codeJson.code), "\"").concat(codeJson.scope ? ", ".concat(JSON.stringify(codeJson.scope)) : '', ")");
	    };
	    return Code;
	}());
	Object.defineProperty(Code.prototype, '_bsontype', { value: 'Code' });

	/** @internal */
	function isDBRefLike(value) {
	    return (isObjectLike(value) &&
	        value.$id != null &&
	        typeof value.$ref === 'string' &&
	        (value.$db == null || typeof value.$db === 'string'));
	}
	/**
	 * A class representation of the BSON DBRef type.
	 * @public
	 * @category BSONType
	 */
	var DBRef = /** @class */ (function () {
	    /**
	     * @param collection - the collection name.
	     * @param oid - the reference ObjectId.
	     * @param db - optional db name, if omitted the reference is local to the current db.
	     */
	    function DBRef(collection, oid, db, fields) {
	        if (!(this instanceof DBRef))
	            return new DBRef(collection, oid, db, fields);
	        // check if namespace has been provided
	        var parts = collection.split('.');
	        if (parts.length === 2) {
	            db = parts.shift();
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            collection = parts.shift();
	        }
	        this.collection = collection;
	        this.oid = oid;
	        this.db = db;
	        this.fields = fields || {};
	    }
	    Object.defineProperty(DBRef.prototype, "namespace", {
	        // Property provided for compatibility with the 1.x parser
	        // the 1.x parser used a "namespace" property, while 4.x uses "collection"
	        /** @internal */
	        get: function () {
	            return this.collection;
	        },
	        set: function (value) {
	            this.collection = value;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    DBRef.prototype.toJSON = function () {
	        var o = Object.assign({
	            $ref: this.collection,
	            $id: this.oid
	        }, this.fields);
	        if (this.db != null)
	            o.$db = this.db;
	        return o;
	    };
	    /** @internal */
	    DBRef.prototype.toExtendedJSON = function (options) {
	        options = options || {};
	        var o = {
	            $ref: this.collection,
	            $id: this.oid
	        };
	        if (options.legacy) {
	            return o;
	        }
	        if (this.db)
	            o.$db = this.db;
	        o = Object.assign(o, this.fields);
	        return o;
	    };
	    /** @internal */
	    DBRef.fromExtendedJSON = function (doc) {
	        var copy = Object.assign({}, doc);
	        delete copy.$ref;
	        delete copy.$id;
	        delete copy.$db;
	        return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
	    };
	    /** @internal */
	    DBRef.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    DBRef.prototype.inspect = function () {
	        // NOTE: if OID is an ObjectId class it will just print the oid string.
	        var oid = this.oid === undefined || this.oid.toString === undefined ? this.oid : this.oid.toString();
	        return "new DBRef(\"".concat(this.namespace, "\", new ObjectId(\"").concat(String(oid), "\")").concat(this.db ? ", \"".concat(this.db, "\"") : '', ")");
	    };
	    return DBRef;
	}());
	Object.defineProperty(DBRef.prototype, '_bsontype', { value: 'DBRef' });

	/**
	 * wasm optimizations, to do native i64 multiplication and divide
	 */
	var wasm = undefined;
	try {
	    wasm = new WebAssembly.Instance(new WebAssembly.Module(
	    // prettier-ignore
	    new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
	}
	catch (_a) {
	    // no wasm support
	}
	var TWO_PWR_16_DBL = 1 << 16;
	var TWO_PWR_24_DBL = 1 << 24;
	var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
	var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
	var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
	/** A cache of the Long representations of small integer values. */
	var INT_CACHE = {};
	/** A cache of the Long representations of small unsigned integer values. */
	var UINT_CACHE = {};
	/**
	 * A class representing a 64-bit integer
	 * @public
	 * @category BSONType
	 * @remarks
	 * The internal representation of a long is the two given signed, 32-bit values.
	 * We use 32-bit pieces because these are the size of integers on which
	 * Javascript performs bit-operations.  For operations like addition and
	 * multiplication, we split each number into 16 bit pieces, which can easily be
	 * multiplied within Javascript's floating-point representation without overflow
	 * or change in sign.
	 * In the algorithms below, we frequently reduce the negative case to the
	 * positive case by negating the input(s) and then post-processing the result.
	 * Note that we must ALWAYS check specially whether those values are MIN_VALUE
	 * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
	 * a positive number, it overflows back into a negative).  Not handling this
	 * case would often result in infinite recursion.
	 * Common constant values ZERO, ONE, NEG_ONE, etc. are found as static properties on this class.
	 */
	var Long = /** @class */ (function () {
	    /**
	     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
	     *  See the from* functions below for more convenient ways of constructing Longs.
	     *
	     * Acceptable signatures are:
	     * - Long(low, high, unsigned?)
	     * - Long(bigint, unsigned?)
	     * - Long(string, unsigned?)
	     *
	     * @param low - The low (signed) 32 bits of the long
	     * @param high - The high (signed) 32 bits of the long
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     */
	    function Long(low, high, unsigned) {
	        if (low === void 0) { low = 0; }
	        if (!(this instanceof Long))
	            return new Long(low, high, unsigned);
	        if (typeof low === 'bigint') {
	            Object.assign(this, Long.fromBigInt(low, !!high));
	        }
	        else if (typeof low === 'string') {
	            Object.assign(this, Long.fromString(low, !!high));
	        }
	        else {
	            this.low = low | 0;
	            this.high = high | 0;
	            this.unsigned = !!unsigned;
	        }
	        Object.defineProperty(this, '__isLong__', {
	            value: true,
	            configurable: false,
	            writable: false,
	            enumerable: false
	        });
	    }
	    /**
	     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits.
	     * Each is assumed to use 32 bits.
	     * @param lowBits - The low 32 bits
	     * @param highBits - The high 32 bits
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @returns The corresponding Long value
	     */
	    Long.fromBits = function (lowBits, highBits, unsigned) {
	        return new Long(lowBits, highBits, unsigned);
	    };
	    /**
	     * Returns a Long representing the given 32 bit integer value.
	     * @param value - The 32 bit integer in question
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @returns The corresponding Long value
	     */
	    Long.fromInt = function (value, unsigned) {
	        var obj, cachedObj, cache;
	        if (unsigned) {
	            value >>>= 0;
	            if ((cache = 0 <= value && value < 256)) {
	                cachedObj = UINT_CACHE[value];
	                if (cachedObj)
	                    return cachedObj;
	            }
	            obj = Long.fromBits(value, (value | 0) < 0 ? -1 : 0, true);
	            if (cache)
	                UINT_CACHE[value] = obj;
	            return obj;
	        }
	        else {
	            value |= 0;
	            if ((cache = -128 <= value && value < 128)) {
	                cachedObj = INT_CACHE[value];
	                if (cachedObj)
	                    return cachedObj;
	            }
	            obj = Long.fromBits(value, value < 0 ? -1 : 0, false);
	            if (cache)
	                INT_CACHE[value] = obj;
	            return obj;
	        }
	    };
	    /**
	     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
	     * @param value - The number in question
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @returns The corresponding Long value
	     */
	    Long.fromNumber = function (value, unsigned) {
	        if (isNaN(value))
	            return unsigned ? Long.UZERO : Long.ZERO;
	        if (unsigned) {
	            if (value < 0)
	                return Long.UZERO;
	            if (value >= TWO_PWR_64_DBL)
	                return Long.MAX_UNSIGNED_VALUE;
	        }
	        else {
	            if (value <= -TWO_PWR_63_DBL)
	                return Long.MIN_VALUE;
	            if (value + 1 >= TWO_PWR_63_DBL)
	                return Long.MAX_VALUE;
	        }
	        if (value < 0)
	            return Long.fromNumber(-value, unsigned).neg();
	        return Long.fromBits(value % TWO_PWR_32_DBL | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
	    };
	    /**
	     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
	     * @param value - The number in question
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @returns The corresponding Long value
	     */
	    Long.fromBigInt = function (value, unsigned) {
	        return Long.fromString(value.toString(), unsigned);
	    };
	    /**
	     * Returns a Long representation of the given string, written using the specified radix.
	     * @param str - The textual representation of the Long
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @param radix - The radix in which the text is written (2-36), defaults to 10
	     * @returns The corresponding Long value
	     */
	    Long.fromString = function (str, unsigned, radix) {
	        if (str.length === 0)
	            throw Error('empty string');
	        if (str === 'NaN' || str === 'Infinity' || str === '+Infinity' || str === '-Infinity')
	            return Long.ZERO;
	        if (typeof unsigned === 'number') {
	            // For goog.math.long compatibility
	            (radix = unsigned), (unsigned = false);
	        }
	        else {
	            unsigned = !!unsigned;
	        }
	        radix = radix || 10;
	        if (radix < 2 || 36 < radix)
	            throw RangeError('radix');
	        var p;
	        if ((p = str.indexOf('-')) > 0)
	            throw Error('interior hyphen');
	        else if (p === 0) {
	            return Long.fromString(str.substring(1), unsigned, radix).neg();
	        }
	        // Do several (8) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        var radixToPower = Long.fromNumber(Math.pow(radix, 8));
	        var result = Long.ZERO;
	        for (var i = 0; i < str.length; i += 8) {
	            var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
	            if (size < 8) {
	                var power = Long.fromNumber(Math.pow(radix, size));
	                result = result.mul(power).add(Long.fromNumber(value));
	            }
	            else {
	                result = result.mul(radixToPower);
	                result = result.add(Long.fromNumber(value));
	            }
	        }
	        result.unsigned = unsigned;
	        return result;
	    };
	    /**
	     * Creates a Long from its byte representation.
	     * @param bytes - Byte representation
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @param le - Whether little or big endian, defaults to big endian
	     * @returns The corresponding Long value
	     */
	    Long.fromBytes = function (bytes, unsigned, le) {
	        return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
	    };
	    /**
	     * Creates a Long from its little endian byte representation.
	     * @param bytes - Little endian byte representation
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @returns The corresponding Long value
	     */
	    Long.fromBytesLE = function (bytes, unsigned) {
	        return new Long(bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24), bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24), unsigned);
	    };
	    /**
	     * Creates a Long from its big endian byte representation.
	     * @param bytes - Big endian byte representation
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     * @returns The corresponding Long value
	     */
	    Long.fromBytesBE = function (bytes, unsigned) {
	        return new Long((bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7], (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3], unsigned);
	    };
	    /**
	     * Tests if the specified object is a Long.
	     */
	    Long.isLong = function (value) {
	        return isObjectLike(value) && value['__isLong__'] === true;
	    };
	    /**
	     * Converts the specified value to a Long.
	     * @param unsigned - Whether unsigned or not, defaults to signed
	     */
	    Long.fromValue = function (val, unsigned) {
	        if (typeof val === 'number')
	            return Long.fromNumber(val, unsigned);
	        if (typeof val === 'string')
	            return Long.fromString(val, unsigned);
	        // Throws for non-objects, converts non-instanceof Long:
	        return Long.fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
	    };
	    /** Returns the sum of this and the specified Long. */
	    Long.prototype.add = function (addend) {
	        if (!Long.isLong(addend))
	            addend = Long.fromValue(addend);
	        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
	        var a48 = this.high >>> 16;
	        var a32 = this.high & 0xffff;
	        var a16 = this.low >>> 16;
	        var a00 = this.low & 0xffff;
	        var b48 = addend.high >>> 16;
	        var b32 = addend.high & 0xffff;
	        var b16 = addend.low >>> 16;
	        var b00 = addend.low & 0xffff;
	        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
	        c00 += a00 + b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xffff;
	        c16 += a16 + b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xffff;
	        c32 += a32 + b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c48 += a48 + b48;
	        c48 &= 0xffff;
	        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
	    };
	    /**
	     * Returns the sum of this and the specified Long.
	     * @returns Sum
	     */
	    Long.prototype.and = function (other) {
	        if (!Long.isLong(other))
	            other = Long.fromValue(other);
	        return Long.fromBits(this.low & other.low, this.high & other.high, this.unsigned);
	    };
	    /**
	     * Compares this Long's value with the specified's.
	     * @returns 0 if they are the same, 1 if the this is greater and -1 if the given one is greater
	     */
	    Long.prototype.compare = function (other) {
	        if (!Long.isLong(other))
	            other = Long.fromValue(other);
	        if (this.eq(other))
	            return 0;
	        var thisNeg = this.isNegative(), otherNeg = other.isNegative();
	        if (thisNeg && !otherNeg)
	            return -1;
	        if (!thisNeg && otherNeg)
	            return 1;
	        // At this point the sign bits are the same
	        if (!this.unsigned)
	            return this.sub(other).isNegative() ? -1 : 1;
	        // Both are positive if at least one is unsigned
	        return other.high >>> 0 > this.high >>> 0 ||
	            (other.high === this.high && other.low >>> 0 > this.low >>> 0)
	            ? -1
	            : 1;
	    };
	    /** This is an alias of {@link Long.compare} */
	    Long.prototype.comp = function (other) {
	        return this.compare(other);
	    };
	    /**
	     * Returns this Long divided by the specified. The result is signed if this Long is signed or unsigned if this Long is unsigned.
	     * @returns Quotient
	     */
	    Long.prototype.divide = function (divisor) {
	        if (!Long.isLong(divisor))
	            divisor = Long.fromValue(divisor);
	        if (divisor.isZero())
	            throw Error('division by zero');
	        // use wasm support if present
	        if (wasm) {
	            // guard against signed division overflow: the largest
	            // negative number / -1 would be 1 larger than the largest
	            // positive number, due to two's complement.
	            if (!this.unsigned &&
	                this.high === -0x80000000 &&
	                divisor.low === -1 &&
	                divisor.high === -1) {
	                // be consistent with non-wasm code path
	                return this;
	            }
	            var low = (this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high);
	            return Long.fromBits(low, wasm.get_high(), this.unsigned);
	        }
	        if (this.isZero())
	            return this.unsigned ? Long.UZERO : Long.ZERO;
	        var approx, rem, res;
	        if (!this.unsigned) {
	            // This section is only relevant for signed longs and is derived from the
	            // closure library as a whole.
	            if (this.eq(Long.MIN_VALUE)) {
	                if (divisor.eq(Long.ONE) || divisor.eq(Long.NEG_ONE))
	                    return Long.MIN_VALUE;
	                // recall that -MIN_VALUE == MIN_VALUE
	                else if (divisor.eq(Long.MIN_VALUE))
	                    return Long.ONE;
	                else {
	                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
	                    var halfThis = this.shr(1);
	                    approx = halfThis.div(divisor).shl(1);
	                    if (approx.eq(Long.ZERO)) {
	                        return divisor.isNegative() ? Long.ONE : Long.NEG_ONE;
	                    }
	                    else {
	                        rem = this.sub(divisor.mul(approx));
	                        res = approx.add(rem.div(divisor));
	                        return res;
	                    }
	                }
	            }
	            else if (divisor.eq(Long.MIN_VALUE))
	                return this.unsigned ? Long.UZERO : Long.ZERO;
	            if (this.isNegative()) {
	                if (divisor.isNegative())
	                    return this.neg().div(divisor.neg());
	                return this.neg().div(divisor).neg();
	            }
	            else if (divisor.isNegative())
	                return this.div(divisor.neg()).neg();
	            res = Long.ZERO;
	        }
	        else {
	            // The algorithm below has not been made for unsigned longs. It's therefore
	            // required to take special care of the MSB prior to running it.
	            if (!divisor.unsigned)
	                divisor = divisor.toUnsigned();
	            if (divisor.gt(this))
	                return Long.UZERO;
	            if (divisor.gt(this.shru(1)))
	                // 15 >>> 1 = 7 ; with divisor = 8 ; true
	                return Long.UONE;
	            res = Long.UZERO;
	        }
	        // Repeat the following until the remainder is less than other:  find a
	        // floating-point that approximates remainder / other *from below*, add this
	        // into the result, and subtract it from the remainder.  It is critical that
	        // the approximate value is less than or equal to the real value so that the
	        // remainder never becomes negative.
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        rem = this;
	        while (rem.gte(divisor)) {
	            // Approximate the result of division. This may be a little greater or
	            // smaller than the actual value.
	            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
	            // We will tweak the approximate result by changing it in the 48-th digit or
	            // the smallest non-fractional digit, whichever is larger.
	            var log2 = Math.ceil(Math.log(approx) / Math.LN2);
	            var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
	            // Decrease the approximation until it is smaller than the remainder.  Note
	            // that if it is too large, the product overflows and is negative.
	            var approxRes = Long.fromNumber(approx);
	            var approxRem = approxRes.mul(divisor);
	            while (approxRem.isNegative() || approxRem.gt(rem)) {
	                approx -= delta;
	                approxRes = Long.fromNumber(approx, this.unsigned);
	                approxRem = approxRes.mul(divisor);
	            }
	            // We know the answer can't be zero... and actually, zero would cause
	            // infinite recursion since we would make no progress.
	            if (approxRes.isZero())
	                approxRes = Long.ONE;
	            res = res.add(approxRes);
	            rem = rem.sub(approxRem);
	        }
	        return res;
	    };
	    /**This is an alias of {@link Long.divide} */
	    Long.prototype.div = function (divisor) {
	        return this.divide(divisor);
	    };
	    /**
	     * Tests if this Long's value equals the specified's.
	     * @param other - Other value
	     */
	    Long.prototype.equals = function (other) {
	        if (!Long.isLong(other))
	            other = Long.fromValue(other);
	        if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
	            return false;
	        return this.high === other.high && this.low === other.low;
	    };
	    /** This is an alias of {@link Long.equals} */
	    Long.prototype.eq = function (other) {
	        return this.equals(other);
	    };
	    /** Gets the high 32 bits as a signed integer. */
	    Long.prototype.getHighBits = function () {
	        return this.high;
	    };
	    /** Gets the high 32 bits as an unsigned integer. */
	    Long.prototype.getHighBitsUnsigned = function () {
	        return this.high >>> 0;
	    };
	    /** Gets the low 32 bits as a signed integer. */
	    Long.prototype.getLowBits = function () {
	        return this.low;
	    };
	    /** Gets the low 32 bits as an unsigned integer. */
	    Long.prototype.getLowBitsUnsigned = function () {
	        return this.low >>> 0;
	    };
	    /** Gets the number of bits needed to represent the absolute value of this Long. */
	    Long.prototype.getNumBitsAbs = function () {
	        if (this.isNegative()) {
	            // Unsigned Longs are never negative
	            return this.eq(Long.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
	        }
	        var val = this.high !== 0 ? this.high : this.low;
	        var bit;
	        for (bit = 31; bit > 0; bit--)
	            if ((val & (1 << bit)) !== 0)
	                break;
	        return this.high !== 0 ? bit + 33 : bit + 1;
	    };
	    /** Tests if this Long's value is greater than the specified's. */
	    Long.prototype.greaterThan = function (other) {
	        return this.comp(other) > 0;
	    };
	    /** This is an alias of {@link Long.greaterThan} */
	    Long.prototype.gt = function (other) {
	        return this.greaterThan(other);
	    };
	    /** Tests if this Long's value is greater than or equal the specified's. */
	    Long.prototype.greaterThanOrEqual = function (other) {
	        return this.comp(other) >= 0;
	    };
	    /** This is an alias of {@link Long.greaterThanOrEqual} */
	    Long.prototype.gte = function (other) {
	        return this.greaterThanOrEqual(other);
	    };
	    /** This is an alias of {@link Long.greaterThanOrEqual} */
	    Long.prototype.ge = function (other) {
	        return this.greaterThanOrEqual(other);
	    };
	    /** Tests if this Long's value is even. */
	    Long.prototype.isEven = function () {
	        return (this.low & 1) === 0;
	    };
	    /** Tests if this Long's value is negative. */
	    Long.prototype.isNegative = function () {
	        return !this.unsigned && this.high < 0;
	    };
	    /** Tests if this Long's value is odd. */
	    Long.prototype.isOdd = function () {
	        return (this.low & 1) === 1;
	    };
	    /** Tests if this Long's value is positive. */
	    Long.prototype.isPositive = function () {
	        return this.unsigned || this.high >= 0;
	    };
	    /** Tests if this Long's value equals zero. */
	    Long.prototype.isZero = function () {
	        return this.high === 0 && this.low === 0;
	    };
	    /** Tests if this Long's value is less than the specified's. */
	    Long.prototype.lessThan = function (other) {
	        return this.comp(other) < 0;
	    };
	    /** This is an alias of {@link Long#lessThan}. */
	    Long.prototype.lt = function (other) {
	        return this.lessThan(other);
	    };
	    /** Tests if this Long's value is less than or equal the specified's. */
	    Long.prototype.lessThanOrEqual = function (other) {
	        return this.comp(other) <= 0;
	    };
	    /** This is an alias of {@link Long.lessThanOrEqual} */
	    Long.prototype.lte = function (other) {
	        return this.lessThanOrEqual(other);
	    };
	    /** Returns this Long modulo the specified. */
	    Long.prototype.modulo = function (divisor) {
	        if (!Long.isLong(divisor))
	            divisor = Long.fromValue(divisor);
	        // use wasm support if present
	        if (wasm) {
	            var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high);
	            return Long.fromBits(low, wasm.get_high(), this.unsigned);
	        }
	        return this.sub(this.div(divisor).mul(divisor));
	    };
	    /** This is an alias of {@link Long.modulo} */
	    Long.prototype.mod = function (divisor) {
	        return this.modulo(divisor);
	    };
	    /** This is an alias of {@link Long.modulo} */
	    Long.prototype.rem = function (divisor) {
	        return this.modulo(divisor);
	    };
	    /**
	     * Returns the product of this and the specified Long.
	     * @param multiplier - Multiplier
	     * @returns Product
	     */
	    Long.prototype.multiply = function (multiplier) {
	        if (this.isZero())
	            return Long.ZERO;
	        if (!Long.isLong(multiplier))
	            multiplier = Long.fromValue(multiplier);
	        // use wasm support if present
	        if (wasm) {
	            var low = wasm.mul(this.low, this.high, multiplier.low, multiplier.high);
	            return Long.fromBits(low, wasm.get_high(), this.unsigned);
	        }
	        if (multiplier.isZero())
	            return Long.ZERO;
	        if (this.eq(Long.MIN_VALUE))
	            return multiplier.isOdd() ? Long.MIN_VALUE : Long.ZERO;
	        if (multiplier.eq(Long.MIN_VALUE))
	            return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
	        if (this.isNegative()) {
	            if (multiplier.isNegative())
	                return this.neg().mul(multiplier.neg());
	            else
	                return this.neg().mul(multiplier).neg();
	        }
	        else if (multiplier.isNegative())
	            return this.mul(multiplier.neg()).neg();
	        // If both longs are small, use float multiplication
	        if (this.lt(Long.TWO_PWR_24) && multiplier.lt(Long.TWO_PWR_24))
	            return Long.fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
	        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
	        // We can skip products that would overflow.
	        var a48 = this.high >>> 16;
	        var a32 = this.high & 0xffff;
	        var a16 = this.low >>> 16;
	        var a00 = this.low & 0xffff;
	        var b48 = multiplier.high >>> 16;
	        var b32 = multiplier.high & 0xffff;
	        var b16 = multiplier.low >>> 16;
	        var b00 = multiplier.low & 0xffff;
	        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
	        c00 += a00 * b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xffff;
	        c16 += a16 * b00;
	        c32 += c16 >>> 16;
	        c16 &= 0xffff;
	        c16 += a00 * b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xffff;
	        c32 += a32 * b00;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c32 += a16 * b16;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c32 += a00 * b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
	        c48 &= 0xffff;
	        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
	    };
	    /** This is an alias of {@link Long.multiply} */
	    Long.prototype.mul = function (multiplier) {
	        return this.multiply(multiplier);
	    };
	    /** Returns the Negation of this Long's value. */
	    Long.prototype.negate = function () {
	        if (!this.unsigned && this.eq(Long.MIN_VALUE))
	            return Long.MIN_VALUE;
	        return this.not().add(Long.ONE);
	    };
	    /** This is an alias of {@link Long.negate} */
	    Long.prototype.neg = function () {
	        return this.negate();
	    };
	    /** Returns the bitwise NOT of this Long. */
	    Long.prototype.not = function () {
	        return Long.fromBits(~this.low, ~this.high, this.unsigned);
	    };
	    /** Tests if this Long's value differs from the specified's. */
	    Long.prototype.notEquals = function (other) {
	        return !this.equals(other);
	    };
	    /** This is an alias of {@link Long.notEquals} */
	    Long.prototype.neq = function (other) {
	        return this.notEquals(other);
	    };
	    /** This is an alias of {@link Long.notEquals} */
	    Long.prototype.ne = function (other) {
	        return this.notEquals(other);
	    };
	    /**
	     * Returns the bitwise OR of this Long and the specified.
	     */
	    Long.prototype.or = function (other) {
	        if (!Long.isLong(other))
	            other = Long.fromValue(other);
	        return Long.fromBits(this.low | other.low, this.high | other.high, this.unsigned);
	    };
	    /**
	     * Returns this Long with bits shifted to the left by the given amount.
	     * @param numBits - Number of bits
	     * @returns Shifted Long
	     */
	    Long.prototype.shiftLeft = function (numBits) {
	        if (Long.isLong(numBits))
	            numBits = numBits.toInt();
	        if ((numBits &= 63) === 0)
	            return this;
	        else if (numBits < 32)
	            return Long.fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
	        else
	            return Long.fromBits(0, this.low << (numBits - 32), this.unsigned);
	    };
	    /** This is an alias of {@link Long.shiftLeft} */
	    Long.prototype.shl = function (numBits) {
	        return this.shiftLeft(numBits);
	    };
	    /**
	     * Returns this Long with bits arithmetically shifted to the right by the given amount.
	     * @param numBits - Number of bits
	     * @returns Shifted Long
	     */
	    Long.prototype.shiftRight = function (numBits) {
	        if (Long.isLong(numBits))
	            numBits = numBits.toInt();
	        if ((numBits &= 63) === 0)
	            return this;
	        else if (numBits < 32)
	            return Long.fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
	        else
	            return Long.fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
	    };
	    /** This is an alias of {@link Long.shiftRight} */
	    Long.prototype.shr = function (numBits) {
	        return this.shiftRight(numBits);
	    };
	    /**
	     * Returns this Long with bits logically shifted to the right by the given amount.
	     * @param numBits - Number of bits
	     * @returns Shifted Long
	     */
	    Long.prototype.shiftRightUnsigned = function (numBits) {
	        if (Long.isLong(numBits))
	            numBits = numBits.toInt();
	        numBits &= 63;
	        if (numBits === 0)
	            return this;
	        else {
	            var high = this.high;
	            if (numBits < 32) {
	                var low = this.low;
	                return Long.fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
	            }
	            else if (numBits === 32)
	                return Long.fromBits(high, 0, this.unsigned);
	            else
	                return Long.fromBits(high >>> (numBits - 32), 0, this.unsigned);
	        }
	    };
	    /** This is an alias of {@link Long.shiftRightUnsigned} */
	    Long.prototype.shr_u = function (numBits) {
	        return this.shiftRightUnsigned(numBits);
	    };
	    /** This is an alias of {@link Long.shiftRightUnsigned} */
	    Long.prototype.shru = function (numBits) {
	        return this.shiftRightUnsigned(numBits);
	    };
	    /**
	     * Returns the difference of this and the specified Long.
	     * @param subtrahend - Subtrahend
	     * @returns Difference
	     */
	    Long.prototype.subtract = function (subtrahend) {
	        if (!Long.isLong(subtrahend))
	            subtrahend = Long.fromValue(subtrahend);
	        return this.add(subtrahend.neg());
	    };
	    /** This is an alias of {@link Long.subtract} */
	    Long.prototype.sub = function (subtrahend) {
	        return this.subtract(subtrahend);
	    };
	    /** Converts the Long to a 32 bit integer, assuming it is a 32 bit integer. */
	    Long.prototype.toInt = function () {
	        return this.unsigned ? this.low >>> 0 : this.low;
	    };
	    /** Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa). */
	    Long.prototype.toNumber = function () {
	        if (this.unsigned)
	            return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
	        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
	    };
	    /** Converts the Long to a BigInt (arbitrary precision). */
	    Long.prototype.toBigInt = function () {
	        return BigInt(this.toString());
	    };
	    /**
	     * Converts this Long to its byte representation.
	     * @param le - Whether little or big endian, defaults to big endian
	     * @returns Byte representation
	     */
	    Long.prototype.toBytes = function (le) {
	        return le ? this.toBytesLE() : this.toBytesBE();
	    };
	    /**
	     * Converts this Long to its little endian byte representation.
	     * @returns Little endian byte representation
	     */
	    Long.prototype.toBytesLE = function () {
	        var hi = this.high, lo = this.low;
	        return [
	            lo & 0xff,
	            (lo >>> 8) & 0xff,
	            (lo >>> 16) & 0xff,
	            lo >>> 24,
	            hi & 0xff,
	            (hi >>> 8) & 0xff,
	            (hi >>> 16) & 0xff,
	            hi >>> 24
	        ];
	    };
	    /**
	     * Converts this Long to its big endian byte representation.
	     * @returns Big endian byte representation
	     */
	    Long.prototype.toBytesBE = function () {
	        var hi = this.high, lo = this.low;
	        return [
	            hi >>> 24,
	            (hi >>> 16) & 0xff,
	            (hi >>> 8) & 0xff,
	            hi & 0xff,
	            lo >>> 24,
	            (lo >>> 16) & 0xff,
	            (lo >>> 8) & 0xff,
	            lo & 0xff
	        ];
	    };
	    /**
	     * Converts this Long to signed.
	     */
	    Long.prototype.toSigned = function () {
	        if (!this.unsigned)
	            return this;
	        return Long.fromBits(this.low, this.high, false);
	    };
	    /**
	     * Converts the Long to a string written in the specified radix.
	     * @param radix - Radix (2-36), defaults to 10
	     * @throws RangeError If `radix` is out of range
	     */
	    Long.prototype.toString = function (radix) {
	        radix = radix || 10;
	        if (radix < 2 || 36 < radix)
	            throw RangeError('radix');
	        if (this.isZero())
	            return '0';
	        if (this.isNegative()) {
	            // Unsigned Longs are never negative
	            if (this.eq(Long.MIN_VALUE)) {
	                // We need to change the Long value before it can be negated, so we remove
	                // the bottom-most digit in this base and then recurse to do the rest.
	                var radixLong = Long.fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
	                return div.toString(radix) + rem1.toInt().toString(radix);
	            }
	            else
	                return '-' + this.neg().toString(radix);
	        }
	        // Do several (6) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        var radixToPower = Long.fromNumber(Math.pow(radix, 6), this.unsigned);
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        var rem = this;
	        var result = '';
	        // eslint-disable-next-line no-constant-condition
	        while (true) {
	            var remDiv = rem.div(radixToPower);
	            var intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0;
	            var digits = intval.toString(radix);
	            rem = remDiv;
	            if (rem.isZero()) {
	                return digits + result;
	            }
	            else {
	                while (digits.length < 6)
	                    digits = '0' + digits;
	                result = '' + digits + result;
	            }
	        }
	    };
	    /** Converts this Long to unsigned. */
	    Long.prototype.toUnsigned = function () {
	        if (this.unsigned)
	            return this;
	        return Long.fromBits(this.low, this.high, true);
	    };
	    /** Returns the bitwise XOR of this Long and the given one. */
	    Long.prototype.xor = function (other) {
	        if (!Long.isLong(other))
	            other = Long.fromValue(other);
	        return Long.fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
	    };
	    /** This is an alias of {@link Long.isZero} */
	    Long.prototype.eqz = function () {
	        return this.isZero();
	    };
	    /** This is an alias of {@link Long.lessThanOrEqual} */
	    Long.prototype.le = function (other) {
	        return this.lessThanOrEqual(other);
	    };
	    /*
	     ****************************************************************
	     *                  BSON SPECIFIC ADDITIONS                     *
	     ****************************************************************
	     */
	    Long.prototype.toExtendedJSON = function (options) {
	        if (options && options.relaxed)
	            return this.toNumber();
	        return { $numberLong: this.toString() };
	    };
	    Long.fromExtendedJSON = function (doc, options) {
	        var result = Long.fromString(doc.$numberLong);
	        return options && options.relaxed ? result.toNumber() : result;
	    };
	    /** @internal */
	    Long.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Long.prototype.inspect = function () {
	        return "new Long(\"".concat(this.toString(), "\"").concat(this.unsigned ? ', true' : '', ")");
	    };
	    Long.TWO_PWR_24 = Long.fromInt(TWO_PWR_24_DBL);
	    /** Maximum unsigned value. */
	    Long.MAX_UNSIGNED_VALUE = Long.fromBits(0xffffffff | 0, 0xffffffff | 0, true);
	    /** Signed zero */
	    Long.ZERO = Long.fromInt(0);
	    /** Unsigned zero. */
	    Long.UZERO = Long.fromInt(0, true);
	    /** Signed one. */
	    Long.ONE = Long.fromInt(1);
	    /** Unsigned one. */
	    Long.UONE = Long.fromInt(1, true);
	    /** Signed negative one. */
	    Long.NEG_ONE = Long.fromInt(-1);
	    /** Maximum signed value. */
	    Long.MAX_VALUE = Long.fromBits(0xffffffff | 0, 0x7fffffff | 0, false);
	    /** Minimum signed value. */
	    Long.MIN_VALUE = Long.fromBits(0, 0x80000000 | 0, false);
	    return Long;
	}());
	Object.defineProperty(Long.prototype, '__isLong__', { value: true });
	Object.defineProperty(Long.prototype, '_bsontype', { value: 'Long' });

	var PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
	var PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
	var PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;
	var EXPONENT_MAX = 6111;
	var EXPONENT_MIN = -6176;
	var EXPONENT_BIAS = 6176;
	var MAX_DIGITS = 34;
	// Nan value bits as 32 bit values (due to lack of longs)
	var NAN_BUFFER = [
	    0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	].reverse();
	// Infinity value bits 32 bit values (due to lack of longs)
	var INF_NEGATIVE_BUFFER = [
	    0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	].reverse();
	var INF_POSITIVE_BUFFER = [
	    0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	].reverse();
	var EXPONENT_REGEX = /^([-+])?(\d+)?$/;
	// Extract least significant 5 bits
	var COMBINATION_MASK = 0x1f;
	// Extract least significant 14 bits
	var EXPONENT_MASK = 0x3fff;
	// Value of combination field for Inf
	var COMBINATION_INFINITY = 30;
	// Value of combination field for NaN
	var COMBINATION_NAN = 31;
	// Detect if the value is a digit
	function isDigit(value) {
	    return !isNaN(parseInt(value, 10));
	}
	// Divide two uint128 values
	function divideu128(value) {
	    var DIVISOR = Long.fromNumber(1000 * 1000 * 1000);
	    var _rem = Long.fromNumber(0);
	    if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
	        return { quotient: value, rem: _rem };
	    }
	    for (var i = 0; i <= 3; i++) {
	        // Adjust remainder to match value of next dividend
	        _rem = _rem.shiftLeft(32);
	        // Add the divided to _rem
	        _rem = _rem.add(new Long(value.parts[i], 0));
	        value.parts[i] = _rem.div(DIVISOR).low;
	        _rem = _rem.modulo(DIVISOR);
	    }
	    return { quotient: value, rem: _rem };
	}
	// Multiply two Long values and return the 128 bit value
	function multiply64x2(left, right) {
	    if (!left && !right) {
	        return { high: Long.fromNumber(0), low: Long.fromNumber(0) };
	    }
	    var leftHigh = left.shiftRightUnsigned(32);
	    var leftLow = new Long(left.getLowBits(), 0);
	    var rightHigh = right.shiftRightUnsigned(32);
	    var rightLow = new Long(right.getLowBits(), 0);
	    var productHigh = leftHigh.multiply(rightHigh);
	    var productMid = leftHigh.multiply(rightLow);
	    var productMid2 = leftLow.multiply(rightHigh);
	    var productLow = leftLow.multiply(rightLow);
	    productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
	    productMid = new Long(productMid.getLowBits(), 0)
	        .add(productMid2)
	        .add(productLow.shiftRightUnsigned(32));
	    productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
	    productLow = productMid.shiftLeft(32).add(new Long(productLow.getLowBits(), 0));
	    // Return the 128 bit result
	    return { high: productHigh, low: productLow };
	}
	function lessThan(left, right) {
	    // Make values unsigned
	    var uhleft = left.high >>> 0;
	    var uhright = right.high >>> 0;
	    // Compare high bits first
	    if (uhleft < uhright) {
	        return true;
	    }
	    else if (uhleft === uhright) {
	        var ulleft = left.low >>> 0;
	        var ulright = right.low >>> 0;
	        if (ulleft < ulright)
	            return true;
	    }
	    return false;
	}
	function invalidErr(string, message) {
	    throw new BSONTypeError("\"".concat(string, "\" is not a valid Decimal128 string - ").concat(message));
	}
	/**
	 * A class representation of the BSON Decimal128 type.
	 * @public
	 * @category BSONType
	 */
	var Decimal128 = /** @class */ (function () {
	    /**
	     * @param bytes - a buffer containing the raw Decimal128 bytes in little endian order,
	     *                or a string representation as returned by .toString()
	     */
	    function Decimal128(bytes) {
	        if (!(this instanceof Decimal128))
	            return new Decimal128(bytes);
	        if (typeof bytes === 'string') {
	            this.bytes = Decimal128.fromString(bytes).bytes;
	        }
	        else if (isUint8Array(bytes)) {
	            if (bytes.byteLength !== 16) {
	                throw new BSONTypeError('Decimal128 must take a Buffer of 16 bytes');
	            }
	            this.bytes = bytes;
	        }
	        else {
	            throw new BSONTypeError('Decimal128 must take a Buffer or string');
	        }
	    }
	    /**
	     * Create a Decimal128 instance from a string representation
	     *
	     * @param representation - a numeric string representation.
	     */
	    Decimal128.fromString = function (representation) {
	        // Parse state tracking
	        var isNegative = false;
	        var sawRadix = false;
	        var foundNonZero = false;
	        // Total number of significant digits (no leading or trailing zero)
	        var significantDigits = 0;
	        // Total number of significand digits read
	        var nDigitsRead = 0;
	        // Total number of digits (no leading zeros)
	        var nDigits = 0;
	        // The number of the digits after radix
	        var radixPosition = 0;
	        // The index of the first non-zero in *str*
	        var firstNonZero = 0;
	        // Digits Array
	        var digits = [0];
	        // The number of digits in digits
	        var nDigitsStored = 0;
	        // Insertion pointer for digits
	        var digitsInsert = 0;
	        // The index of the first non-zero digit
	        var firstDigit = 0;
	        // The index of the last digit
	        var lastDigit = 0;
	        // Exponent
	        var exponent = 0;
	        // loop index over array
	        var i = 0;
	        // The high 17 digits of the significand
	        var significandHigh = new Long(0, 0);
	        // The low 17 digits of the significand
	        var significandLow = new Long(0, 0);
	        // The biased exponent
	        var biasedExponent = 0;
	        // Read index
	        var index = 0;
	        // Naively prevent against REDOS attacks.
	        // TODO: implementing a custom parsing for this, or refactoring the regex would yield
	        //       further gains.
	        if (representation.length >= 7000) {
	            throw new BSONTypeError('' + representation + ' not a valid Decimal128 string');
	        }
	        // Results
	        var stringMatch = representation.match(PARSE_STRING_REGEXP);
	        var infMatch = representation.match(PARSE_INF_REGEXP);
	        var nanMatch = representation.match(PARSE_NAN_REGEXP);
	        // Validate the string
	        if ((!stringMatch && !infMatch && !nanMatch) || representation.length === 0) {
	            throw new BSONTypeError('' + representation + ' not a valid Decimal128 string');
	        }
	        if (stringMatch) {
	            // full_match = stringMatch[0]
	            // sign = stringMatch[1]
	            var unsignedNumber = stringMatch[2];
	            // stringMatch[3] is undefined if a whole number (ex "1", 12")
	            // but defined if a number w/ decimal in it (ex "1.0, 12.2")
	            var e = stringMatch[4];
	            var expSign = stringMatch[5];
	            var expNumber = stringMatch[6];
	            // they provided e, but didn't give an exponent number. for ex "1e"
	            if (e && expNumber === undefined)
	                invalidErr(representation, 'missing exponent power');
	            // they provided e, but didn't give a number before it. for ex "e1"
	            if (e && unsignedNumber === undefined)
	                invalidErr(representation, 'missing exponent base');
	            if (e === undefined && (expSign || expNumber)) {
	                invalidErr(representation, 'missing e before exponent');
	            }
	        }
	        // Get the negative or positive sign
	        if (representation[index] === '+' || representation[index] === '-') {
	            isNegative = representation[index++] === '-';
	        }
	        // Check if user passed Infinity or NaN
	        if (!isDigit(representation[index]) && representation[index] !== '.') {
	            if (representation[index] === 'i' || representation[index] === 'I') {
	                return new Decimal128(buffer_1.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
	            }
	            else if (representation[index] === 'N') {
	                return new Decimal128(buffer_1.from(NAN_BUFFER));
	            }
	        }
	        // Read all the digits
	        while (isDigit(representation[index]) || representation[index] === '.') {
	            if (representation[index] === '.') {
	                if (sawRadix)
	                    invalidErr(representation, 'contains multiple periods');
	                sawRadix = true;
	                index = index + 1;
	                continue;
	            }
	            if (nDigitsStored < 34) {
	                if (representation[index] !== '0' || foundNonZero) {
	                    if (!foundNonZero) {
	                        firstNonZero = nDigitsRead;
	                    }
	                    foundNonZero = true;
	                    // Only store 34 digits
	                    digits[digitsInsert++] = parseInt(representation[index], 10);
	                    nDigitsStored = nDigitsStored + 1;
	                }
	            }
	            if (foundNonZero)
	                nDigits = nDigits + 1;
	            if (sawRadix)
	                radixPosition = radixPosition + 1;
	            nDigitsRead = nDigitsRead + 1;
	            index = index + 1;
	        }
	        if (sawRadix && !nDigitsRead)
	            throw new BSONTypeError('' + representation + ' not a valid Decimal128 string');
	        // Read exponent if exists
	        if (representation[index] === 'e' || representation[index] === 'E') {
	            // Read exponent digits
	            var match = representation.substr(++index).match(EXPONENT_REGEX);
	            // No digits read
	            if (!match || !match[2])
	                return new Decimal128(buffer_1.from(NAN_BUFFER));
	            // Get exponent
	            exponent = parseInt(match[0], 10);
	            // Adjust the index
	            index = index + match[0].length;
	        }
	        // Return not a number
	        if (representation[index])
	            return new Decimal128(buffer_1.from(NAN_BUFFER));
	        // Done reading input
	        // Find first non-zero digit in digits
	        firstDigit = 0;
	        if (!nDigitsStored) {
	            firstDigit = 0;
	            lastDigit = 0;
	            digits[0] = 0;
	            nDigits = 1;
	            nDigitsStored = 1;
	            significantDigits = 0;
	        }
	        else {
	            lastDigit = nDigitsStored - 1;
	            significantDigits = nDigits;
	            if (significantDigits !== 1) {
	                while (digits[firstNonZero + significantDigits - 1] === 0) {
	                    significantDigits = significantDigits - 1;
	                }
	            }
	        }
	        // Normalization of exponent
	        // Correct exponent based on radix position, and shift significand as needed
	        // to represent user input
	        // Overflow prevention
	        if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
	            exponent = EXPONENT_MIN;
	        }
	        else {
	            exponent = exponent - radixPosition;
	        }
	        // Attempt to normalize the exponent
	        while (exponent > EXPONENT_MAX) {
	            // Shift exponent to significand and decrease
	            lastDigit = lastDigit + 1;
	            if (lastDigit - firstDigit > MAX_DIGITS) {
	                // Check if we have a zero then just hard clamp, otherwise fail
	                var digitsString = digits.join('');
	                if (digitsString.match(/^0+$/)) {
	                    exponent = EXPONENT_MAX;
	                    break;
	                }
	                invalidErr(representation, 'overflow');
	            }
	            exponent = exponent - 1;
	        }
	        while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
	            // Shift last digit. can only do this if < significant digits than # stored.
	            if (lastDigit === 0 && significantDigits < nDigitsStored) {
	                exponent = EXPONENT_MIN;
	                significantDigits = 0;
	                break;
	            }
	            if (nDigitsStored < nDigits) {
	                // adjust to match digits not stored
	                nDigits = nDigits - 1;
	            }
	            else {
	                // adjust to round
	                lastDigit = lastDigit - 1;
	            }
	            if (exponent < EXPONENT_MAX) {
	                exponent = exponent + 1;
	            }
	            else {
	                // Check if we have a zero then just hard clamp, otherwise fail
	                var digitsString = digits.join('');
	                if (digitsString.match(/^0+$/)) {
	                    exponent = EXPONENT_MAX;
	                    break;
	                }
	                invalidErr(representation, 'overflow');
	            }
	        }
	        // Round
	        // We've normalized the exponent, but might still need to round.
	        if (lastDigit - firstDigit + 1 < significantDigits) {
	            var endOfString = nDigitsRead;
	            // If we have seen a radix point, 'string' is 1 longer than we have
	            // documented with ndigits_read, so inc the position of the first nonzero
	            // digit and the position that digits are read to.
	            if (sawRadix) {
	                firstNonZero = firstNonZero + 1;
	                endOfString = endOfString + 1;
	            }
	            // if negative, we need to increment again to account for - sign at start.
	            if (isNegative) {
	                firstNonZero = firstNonZero + 1;
	                endOfString = endOfString + 1;
	            }
	            var roundDigit = parseInt(representation[firstNonZero + lastDigit + 1], 10);
	            var roundBit = 0;
	            if (roundDigit >= 5) {
	                roundBit = 1;
	                if (roundDigit === 5) {
	                    roundBit = digits[lastDigit] % 2 === 1 ? 1 : 0;
	                    for (i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
	                        if (parseInt(representation[i], 10)) {
	                            roundBit = 1;
	                            break;
	                        }
	                    }
	                }
	            }
	            if (roundBit) {
	                var dIdx = lastDigit;
	                for (; dIdx >= 0; dIdx--) {
	                    if (++digits[dIdx] > 9) {
	                        digits[dIdx] = 0;
	                        // overflowed most significant digit
	                        if (dIdx === 0) {
	                            if (exponent < EXPONENT_MAX) {
	                                exponent = exponent + 1;
	                                digits[dIdx] = 1;
	                            }
	                            else {
	                                return new Decimal128(buffer_1.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        // Encode significand
	        // The high 17 digits of the significand
	        significandHigh = Long.fromNumber(0);
	        // The low 17 digits of the significand
	        significandLow = Long.fromNumber(0);
	        // read a zero
	        if (significantDigits === 0) {
	            significandHigh = Long.fromNumber(0);
	            significandLow = Long.fromNumber(0);
	        }
	        else if (lastDigit - firstDigit < 17) {
	            var dIdx = firstDigit;
	            significandLow = Long.fromNumber(digits[dIdx++]);
	            significandHigh = new Long(0, 0);
	            for (; dIdx <= lastDigit; dIdx++) {
	                significandLow = significandLow.multiply(Long.fromNumber(10));
	                significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
	            }
	        }
	        else {
	            var dIdx = firstDigit;
	            significandHigh = Long.fromNumber(digits[dIdx++]);
	            for (; dIdx <= lastDigit - 17; dIdx++) {
	                significandHigh = significandHigh.multiply(Long.fromNumber(10));
	                significandHigh = significandHigh.add(Long.fromNumber(digits[dIdx]));
	            }
	            significandLow = Long.fromNumber(digits[dIdx++]);
	            for (; dIdx <= lastDigit; dIdx++) {
	                significandLow = significandLow.multiply(Long.fromNumber(10));
	                significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
	            }
	        }
	        var significand = multiply64x2(significandHigh, Long.fromString('100000000000000000'));
	        significand.low = significand.low.add(significandLow);
	        if (lessThan(significand.low, significandLow)) {
	            significand.high = significand.high.add(Long.fromNumber(1));
	        }
	        // Biased exponent
	        biasedExponent = exponent + EXPONENT_BIAS;
	        var dec = { low: Long.fromNumber(0), high: Long.fromNumber(0) };
	        // Encode combination, exponent, and significand.
	        if (significand.high.shiftRightUnsigned(49).and(Long.fromNumber(1)).equals(Long.fromNumber(1))) {
	            // Encode '11' into bits 1 to 3
	            dec.high = dec.high.or(Long.fromNumber(0x3).shiftLeft(61));
	            dec.high = dec.high.or(Long.fromNumber(biasedExponent).and(Long.fromNumber(0x3fff).shiftLeft(47)));
	            dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x7fffffffffff)));
	        }
	        else {
	            dec.high = dec.high.or(Long.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
	            dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x1ffffffffffff)));
	        }
	        dec.low = significand.low;
	        // Encode sign
	        if (isNegative) {
	            dec.high = dec.high.or(Long.fromString('9223372036854775808'));
	        }
	        // Encode into a buffer
	        var buffer = buffer_1.alloc(16);
	        index = 0;
	        // Encode the low 64 bits of the decimal
	        // Encode low bits
	        buffer[index++] = dec.low.low & 0xff;
	        buffer[index++] = (dec.low.low >> 8) & 0xff;
	        buffer[index++] = (dec.low.low >> 16) & 0xff;
	        buffer[index++] = (dec.low.low >> 24) & 0xff;
	        // Encode high bits
	        buffer[index++] = dec.low.high & 0xff;
	        buffer[index++] = (dec.low.high >> 8) & 0xff;
	        buffer[index++] = (dec.low.high >> 16) & 0xff;
	        buffer[index++] = (dec.low.high >> 24) & 0xff;
	        // Encode the high 64 bits of the decimal
	        // Encode low bits
	        buffer[index++] = dec.high.low & 0xff;
	        buffer[index++] = (dec.high.low >> 8) & 0xff;
	        buffer[index++] = (dec.high.low >> 16) & 0xff;
	        buffer[index++] = (dec.high.low >> 24) & 0xff;
	        // Encode high bits
	        buffer[index++] = dec.high.high & 0xff;
	        buffer[index++] = (dec.high.high >> 8) & 0xff;
	        buffer[index++] = (dec.high.high >> 16) & 0xff;
	        buffer[index++] = (dec.high.high >> 24) & 0xff;
	        // Return the new Decimal128
	        return new Decimal128(buffer);
	    };
	    /** Create a string representation of the raw Decimal128 value */
	    Decimal128.prototype.toString = function () {
	        // Note: bits in this routine are referred to starting at 0,
	        // from the sign bit, towards the coefficient.
	        // decoded biased exponent (14 bits)
	        var biased_exponent;
	        // the number of significand digits
	        var significand_digits = 0;
	        // the base-10 digits in the significand
	        var significand = new Array(36);
	        for (var i = 0; i < significand.length; i++)
	            significand[i] = 0;
	        // read pointer into significand
	        var index = 0;
	        // true if the number is zero
	        var is_zero = false;
	        // the most significant significand bits (50-46)
	        var significand_msb;
	        // temporary storage for significand decoding
	        var significand128 = { parts: [0, 0, 0, 0] };
	        // indexing variables
	        var j, k;
	        // Output string
	        var string = [];
	        // Unpack index
	        index = 0;
	        // Buffer reference
	        var buffer = this.bytes;
	        // Unpack the low 64bits into a long
	        // bits 96 - 127
	        var low = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
	        // bits 64 - 95
	        var midl = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
	        // Unpack the high 64bits into a long
	        // bits 32 - 63
	        var midh = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
	        // bits 0 - 31
	        var high = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
	        // Unpack index
	        index = 0;
	        // Create the state of the decimal
	        var dec = {
	            low: new Long(low, midl),
	            high: new Long(midh, high)
	        };
	        if (dec.high.lessThan(Long.ZERO)) {
	            string.push('-');
	        }
	        // Decode combination field and exponent
	        // bits 1 - 5
	        var combination = (high >> 26) & COMBINATION_MASK;
	        if (combination >> 3 === 3) {
	            // Check for 'special' values
	            if (combination === COMBINATION_INFINITY) {
	                return string.join('') + 'Infinity';
	            }
	            else if (combination === COMBINATION_NAN) {
	                return 'NaN';
	            }
	            else {
	                biased_exponent = (high >> 15) & EXPONENT_MASK;
	                significand_msb = 0x08 + ((high >> 14) & 0x01);
	            }
	        }
	        else {
	            significand_msb = (high >> 14) & 0x07;
	            biased_exponent = (high >> 17) & EXPONENT_MASK;
	        }
	        // unbiased exponent
	        var exponent = biased_exponent - EXPONENT_BIAS;
	        // Create string of significand digits
	        // Convert the 114-bit binary number represented by
	        // (significand_high, significand_low) to at most 34 decimal
	        // digits through modulo and division.
	        significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
	        significand128.parts[1] = midh;
	        significand128.parts[2] = midl;
	        significand128.parts[3] = low;
	        if (significand128.parts[0] === 0 &&
	            significand128.parts[1] === 0 &&
	            significand128.parts[2] === 0 &&
	            significand128.parts[3] === 0) {
	            is_zero = true;
	        }
	        else {
	            for (k = 3; k >= 0; k--) {
	                var least_digits = 0;
	                // Perform the divide
	                var result = divideu128(significand128);
	                significand128 = result.quotient;
	                least_digits = result.rem.low;
	                // We now have the 9 least significant digits (in base 2).
	                // Convert and output to string.
	                if (!least_digits)
	                    continue;
	                for (j = 8; j >= 0; j--) {
	                    // significand[k * 9 + j] = Math.round(least_digits % 10);
	                    significand[k * 9 + j] = least_digits % 10;
	                    // least_digits = Math.round(least_digits / 10);
	                    least_digits = Math.floor(least_digits / 10);
	                }
	            }
	        }
	        // Output format options:
	        // Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
	        // Regular    - ddd.ddd
	        if (is_zero) {
	            significand_digits = 1;
	            significand[index] = 0;
	        }
	        else {
	            significand_digits = 36;
	            while (!significand[index]) {
	                significand_digits = significand_digits - 1;
	                index = index + 1;
	            }
	        }
	        // the exponent if scientific notation is used
	        var scientific_exponent = significand_digits - 1 + exponent;
	        // The scientific exponent checks are dictated by the string conversion
	        // specification and are somewhat arbitrary cutoffs.
	        //
	        // We must check exponent > 0, because if this is the case, the number
	        // has trailing zeros.  However, we *cannot* output these trailing zeros,
	        // because doing so would change the precision of the value, and would
	        // change stored data if the string converted number is round tripped.
	        if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
	            // Scientific format
	            // if there are too many significant digits, we should just be treating numbers
	            // as + or - 0 and using the non-scientific exponent (this is for the "invalid
	            // representation should be treated as 0/-0" spec cases in decimal128-1.json)
	            if (significand_digits > 34) {
	                string.push("".concat(0));
	                if (exponent > 0)
	                    string.push("E+".concat(exponent));
	                else if (exponent < 0)
	                    string.push("E".concat(exponent));
	                return string.join('');
	            }
	            string.push("".concat(significand[index++]));
	            significand_digits = significand_digits - 1;
	            if (significand_digits) {
	                string.push('.');
	            }
	            for (var i = 0; i < significand_digits; i++) {
	                string.push("".concat(significand[index++]));
	            }
	            // Exponent
	            string.push('E');
	            if (scientific_exponent > 0) {
	                string.push("+".concat(scientific_exponent));
	            }
	            else {
	                string.push("".concat(scientific_exponent));
	            }
	        }
	        else {
	            // Regular format with no decimal place
	            if (exponent >= 0) {
	                for (var i = 0; i < significand_digits; i++) {
	                    string.push("".concat(significand[index++]));
	                }
	            }
	            else {
	                var radix_position = significand_digits + exponent;
	                // non-zero digits before radix
	                if (radix_position > 0) {
	                    for (var i = 0; i < radix_position; i++) {
	                        string.push("".concat(significand[index++]));
	                    }
	                }
	                else {
	                    string.push('0');
	                }
	                string.push('.');
	                // add leading zeros after radix
	                while (radix_position++ < 0) {
	                    string.push('0');
	                }
	                for (var i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
	                    string.push("".concat(significand[index++]));
	                }
	            }
	        }
	        return string.join('');
	    };
	    Decimal128.prototype.toJSON = function () {
	        return { $numberDecimal: this.toString() };
	    };
	    /** @internal */
	    Decimal128.prototype.toExtendedJSON = function () {
	        return { $numberDecimal: this.toString() };
	    };
	    /** @internal */
	    Decimal128.fromExtendedJSON = function (doc) {
	        return Decimal128.fromString(doc.$numberDecimal);
	    };
	    /** @internal */
	    Decimal128.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Decimal128.prototype.inspect = function () {
	        return "new Decimal128(\"".concat(this.toString(), "\")");
	    };
	    return Decimal128;
	}());
	Object.defineProperty(Decimal128.prototype, '_bsontype', { value: 'Decimal128' });

	/**
	 * A class representation of the BSON Double type.
	 * @public
	 * @category BSONType
	 */
	var Double = /** @class */ (function () {
	    /**
	     * Create a Double type
	     *
	     * @param value - the number we want to represent as a double.
	     */
	    function Double(value) {
	        if (!(this instanceof Double))
	            return new Double(value);
	        if (value instanceof Number) {
	            value = value.valueOf();
	        }
	        this.value = +value;
	    }
	    /**
	     * Access the number value.
	     *
	     * @returns returns the wrapped double number.
	     */
	    Double.prototype.valueOf = function () {
	        return this.value;
	    };
	    Double.prototype.toJSON = function () {
	        return this.value;
	    };
	    Double.prototype.toString = function (radix) {
	        return this.value.toString(radix);
	    };
	    /** @internal */
	    Double.prototype.toExtendedJSON = function (options) {
	        if (options && (options.legacy || (options.relaxed && isFinite(this.value)))) {
	            return this.value;
	        }
	        if (Object.is(Math.sign(this.value), -0)) {
	            // NOTE: JavaScript has +0 and -0, apparently to model limit calculations. If a user
	            // explicitly provided `-0` then we need to ensure the sign makes it into the output
	            return { $numberDouble: '-0.0' };
	        }
	        if (Number.isInteger(this.value)) {
	            return { $numberDouble: "".concat(this.value, ".0") };
	        }
	        else {
	            return { $numberDouble: "".concat(this.value) };
	        }
	    };
	    /** @internal */
	    Double.fromExtendedJSON = function (doc, options) {
	        var doubleValue = parseFloat(doc.$numberDouble);
	        return options && options.relaxed ? doubleValue : new Double(doubleValue);
	    };
	    /** @internal */
	    Double.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Double.prototype.inspect = function () {
	        var eJSON = this.toExtendedJSON();
	        return "new Double(".concat(eJSON.$numberDouble, ")");
	    };
	    return Double;
	}());
	Object.defineProperty(Double.prototype, '_bsontype', { value: 'Double' });

	/**
	 * A class representation of a BSON Int32 type.
	 * @public
	 * @category BSONType
	 */
	var Int32 = /** @class */ (function () {
	    /**
	     * Create an Int32 type
	     *
	     * @param value - the number we want to represent as an int32.
	     */
	    function Int32(value) {
	        if (!(this instanceof Int32))
	            return new Int32(value);
	        if (value instanceof Number) {
	            value = value.valueOf();
	        }
	        this.value = +value | 0;
	    }
	    /**
	     * Access the number value.
	     *
	     * @returns returns the wrapped int32 number.
	     */
	    Int32.prototype.valueOf = function () {
	        return this.value;
	    };
	    Int32.prototype.toString = function (radix) {
	        return this.value.toString(radix);
	    };
	    Int32.prototype.toJSON = function () {
	        return this.value;
	    };
	    /** @internal */
	    Int32.prototype.toExtendedJSON = function (options) {
	        if (options && (options.relaxed || options.legacy))
	            return this.value;
	        return { $numberInt: this.value.toString() };
	    };
	    /** @internal */
	    Int32.fromExtendedJSON = function (doc, options) {
	        return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new Int32(doc.$numberInt);
	    };
	    /** @internal */
	    Int32.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Int32.prototype.inspect = function () {
	        return "new Int32(".concat(this.valueOf(), ")");
	    };
	    return Int32;
	}());
	Object.defineProperty(Int32.prototype, '_bsontype', { value: 'Int32' });

	/**
	 * A class representation of the BSON MaxKey type.
	 * @public
	 * @category BSONType
	 */
	var MaxKey = /** @class */ (function () {
	    function MaxKey() {
	        if (!(this instanceof MaxKey))
	            return new MaxKey();
	    }
	    /** @internal */
	    MaxKey.prototype.toExtendedJSON = function () {
	        return { $maxKey: 1 };
	    };
	    /** @internal */
	    MaxKey.fromExtendedJSON = function () {
	        return new MaxKey();
	    };
	    /** @internal */
	    MaxKey.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    MaxKey.prototype.inspect = function () {
	        return 'new MaxKey()';
	    };
	    return MaxKey;
	}());
	Object.defineProperty(MaxKey.prototype, '_bsontype', { value: 'MaxKey' });

	/**
	 * A class representation of the BSON MinKey type.
	 * @public
	 * @category BSONType
	 */
	var MinKey = /** @class */ (function () {
	    function MinKey() {
	        if (!(this instanceof MinKey))
	            return new MinKey();
	    }
	    /** @internal */
	    MinKey.prototype.toExtendedJSON = function () {
	        return { $minKey: 1 };
	    };
	    /** @internal */
	    MinKey.fromExtendedJSON = function () {
	        return new MinKey();
	    };
	    /** @internal */
	    MinKey.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    MinKey.prototype.inspect = function () {
	        return 'new MinKey()';
	    };
	    return MinKey;
	}());
	Object.defineProperty(MinKey.prototype, '_bsontype', { value: 'MinKey' });

	// Regular expression that checks for hex value
	var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
	// Unique sequence for the current process (initialized on first use)
	var PROCESS_UNIQUE = null;
	var kId = Symbol('id');
	/**
	 * A class representation of the BSON ObjectId type.
	 * @public
	 * @category BSONType
	 */
	var ObjectId = /** @class */ (function () {
	    /**
	     * Create an ObjectId type
	     *
	     * @param inputId - Can be a 24 character hex string, 12 byte binary Buffer, or a number.
	     */
	    function ObjectId(inputId) {
	        if (!(this instanceof ObjectId))
	            return new ObjectId(inputId);
	        // workingId is set based on type of input and whether valid id exists for the input
	        var workingId;
	        if (typeof inputId === 'object' && inputId && 'id' in inputId) {
	            if (typeof inputId.id !== 'string' && !ArrayBuffer.isView(inputId.id)) {
	                throw new BSONTypeError('Argument passed in must have an id that is of type string or Buffer');
	            }
	            if ('toHexString' in inputId && typeof inputId.toHexString === 'function') {
	                workingId = buffer_1.from(inputId.toHexString(), 'hex');
	            }
	            else {
	                workingId = inputId.id;
	            }
	        }
	        else {
	            workingId = inputId;
	        }
	        // the following cases use workingId to construct an ObjectId
	        if (workingId == null || typeof workingId === 'number') {
	            // The most common use case (blank id, new objectId instance)
	            // Generate a new id
	            this[kId] = ObjectId.generate(typeof workingId === 'number' ? workingId : undefined);
	        }
	        else if (ArrayBuffer.isView(workingId) && workingId.byteLength === 12) {
	            // If intstanceof matches we can escape calling ensure buffer in Node.js environments
	            this[kId] = workingId instanceof buffer_1 ? workingId : ensureBuffer(workingId);
	        }
	        else if (typeof workingId === 'string') {
	            if (workingId.length === 12) {
	                var bytes = buffer_1.from(workingId);
	                if (bytes.byteLength === 12) {
	                    this[kId] = bytes;
	                }
	                else {
	                    throw new BSONTypeError('Argument passed in must be a string of 12 bytes');
	                }
	            }
	            else if (workingId.length === 24 && checkForHexRegExp.test(workingId)) {
	                this[kId] = buffer_1.from(workingId, 'hex');
	            }
	            else {
	                throw new BSONTypeError('Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer');
	            }
	        }
	        else {
	            throw new BSONTypeError('Argument passed in does not match the accepted types');
	        }
	        // If we are caching the hex string
	        if (ObjectId.cacheHexString) {
	            this.__id = this.id.toString('hex');
	        }
	    }
	    Object.defineProperty(ObjectId.prototype, "id", {
	        /**
	         * The ObjectId bytes
	         * @readonly
	         */
	        get: function () {
	            return this[kId];
	        },
	        set: function (value) {
	            this[kId] = value;
	            if (ObjectId.cacheHexString) {
	                this.__id = value.toString('hex');
	            }
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(ObjectId.prototype, "generationTime", {
	        /**
	         * The generation time of this ObjectId instance
	         * @deprecated Please use getTimestamp / createFromTime which returns an int32 epoch
	         */
	        get: function () {
	            return this.id.readInt32BE(0);
	        },
	        set: function (value) {
	            // Encode time into first 4 bytes
	            this.id.writeUInt32BE(value, 0);
	        },
	        enumerable: false,
	        configurable: true
	    });
	    /** Returns the ObjectId id as a 24 character hex string representation */
	    ObjectId.prototype.toHexString = function () {
	        if (ObjectId.cacheHexString && this.__id) {
	            return this.__id;
	        }
	        var hexString = this.id.toString('hex');
	        if (ObjectId.cacheHexString && !this.__id) {
	            this.__id = hexString;
	        }
	        return hexString;
	    };
	    /**
	     * Update the ObjectId index
	     * @privateRemarks
	     * Used in generating new ObjectId's on the driver
	     * @internal
	     */
	    ObjectId.getInc = function () {
	        return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
	    };
	    /**
	     * Generate a 12 byte id buffer used in ObjectId's
	     *
	     * @param time - pass in a second based timestamp.
	     */
	    ObjectId.generate = function (time) {
	        if ('number' !== typeof time) {
	            time = Math.floor(Date.now() / 1000);
	        }
	        var inc = ObjectId.getInc();
	        var buffer = buffer_1.alloc(12);
	        // 4-byte timestamp
	        buffer.writeUInt32BE(time, 0);
	        // set PROCESS_UNIQUE if yet not initialized
	        if (PROCESS_UNIQUE === null) {
	            PROCESS_UNIQUE = randomBytes(5);
	        }
	        // 5-byte process unique
	        buffer[4] = PROCESS_UNIQUE[0];
	        buffer[5] = PROCESS_UNIQUE[1];
	        buffer[6] = PROCESS_UNIQUE[2];
	        buffer[7] = PROCESS_UNIQUE[3];
	        buffer[8] = PROCESS_UNIQUE[4];
	        // 3-byte counter
	        buffer[11] = inc & 0xff;
	        buffer[10] = (inc >> 8) & 0xff;
	        buffer[9] = (inc >> 16) & 0xff;
	        return buffer;
	    };
	    /**
	     * Converts the id into a 24 character hex string for printing
	     *
	     * @param format - The Buffer toString format parameter.
	     */
	    ObjectId.prototype.toString = function (format) {
	        // Is the id a buffer then use the buffer toString method to return the format
	        if (format)
	            return this.id.toString(format);
	        return this.toHexString();
	    };
	    /** Converts to its JSON the 24 character hex string representation. */
	    ObjectId.prototype.toJSON = function () {
	        return this.toHexString();
	    };
	    /**
	     * Compares the equality of this ObjectId with `otherID`.
	     *
	     * @param otherId - ObjectId instance to compare against.
	     */
	    ObjectId.prototype.equals = function (otherId) {
	        if (otherId === undefined || otherId === null) {
	            return false;
	        }
	        if (otherId instanceof ObjectId) {
	            return this[kId][11] === otherId[kId][11] && this[kId].equals(otherId[kId]);
	        }
	        if (typeof otherId === 'string' &&
	            ObjectId.isValid(otherId) &&
	            otherId.length === 12 &&
	            isUint8Array(this.id)) {
	            return otherId === buffer_1.prototype.toString.call(this.id, 'latin1');
	        }
	        if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 24) {
	            return otherId.toLowerCase() === this.toHexString();
	        }
	        if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12) {
	            return buffer_1.from(otherId).equals(this.id);
	        }
	        if (typeof otherId === 'object' &&
	            'toHexString' in otherId &&
	            typeof otherId.toHexString === 'function') {
	            var otherIdString = otherId.toHexString();
	            var thisIdString = this.toHexString().toLowerCase();
	            return typeof otherIdString === 'string' && otherIdString.toLowerCase() === thisIdString;
	        }
	        return false;
	    };
	    /** Returns the generation date (accurate up to the second) that this ID was generated. */
	    ObjectId.prototype.getTimestamp = function () {
	        var timestamp = new Date();
	        var time = this.id.readUInt32BE(0);
	        timestamp.setTime(Math.floor(time) * 1000);
	        return timestamp;
	    };
	    /** @internal */
	    ObjectId.createPk = function () {
	        return new ObjectId();
	    };
	    /**
	     * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
	     *
	     * @param time - an integer number representing a number of seconds.
	     */
	    ObjectId.createFromTime = function (time) {
	        var buffer = buffer_1.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	        // Encode time into first 4 bytes
	        buffer.writeUInt32BE(time, 0);
	        // Return the new objectId
	        return new ObjectId(buffer);
	    };
	    /**
	     * Creates an ObjectId from a hex string representation of an ObjectId.
	     *
	     * @param hexString - create a ObjectId from a passed in 24 character hexstring.
	     */
	    ObjectId.createFromHexString = function (hexString) {
	        // Throw an error if it's not a valid setup
	        if (typeof hexString === 'undefined' || (hexString != null && hexString.length !== 24)) {
	            throw new BSONTypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	        }
	        return new ObjectId(buffer_1.from(hexString, 'hex'));
	    };
	    /**
	     * Checks if a value is a valid bson ObjectId
	     *
	     * @param id - ObjectId instance to validate.
	     */
	    ObjectId.isValid = function (id) {
	        if (id == null)
	            return false;
	        try {
	            new ObjectId(id);
	            return true;
	        }
	        catch (_a) {
	            return false;
	        }
	    };
	    /** @internal */
	    ObjectId.prototype.toExtendedJSON = function () {
	        if (this.toHexString)
	            return { $oid: this.toHexString() };
	        return { $oid: this.toString('hex') };
	    };
	    /** @internal */
	    ObjectId.fromExtendedJSON = function (doc) {
	        return new ObjectId(doc.$oid);
	    };
	    /**
	     * Converts to a string representation of this Id.
	     *
	     * @returns return the 24 character hex string representation.
	     * @internal
	     */
	    ObjectId.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    ObjectId.prototype.inspect = function () {
	        return "new ObjectId(\"".concat(this.toHexString(), "\")");
	    };
	    /** @internal */
	    ObjectId.index = Math.floor(Math.random() * 0xffffff);
	    return ObjectId;
	}());
	// Deprecated methods
	Object.defineProperty(ObjectId.prototype, 'generate', {
	    value: deprecate(function (time) { return ObjectId.generate(time); }, 'Please use the static `ObjectId.generate(time)` instead')
	});
	Object.defineProperty(ObjectId.prototype, 'getInc', {
	    value: deprecate(function () { return ObjectId.getInc(); }, 'Please use the static `ObjectId.getInc()` instead')
	});
	Object.defineProperty(ObjectId.prototype, 'get_inc', {
	    value: deprecate(function () { return ObjectId.getInc(); }, 'Please use the static `ObjectId.getInc()` instead')
	});
	Object.defineProperty(ObjectId, 'get_inc', {
	    value: deprecate(function () { return ObjectId.getInc(); }, 'Please use the static `ObjectId.getInc()` instead')
	});
	Object.defineProperty(ObjectId.prototype, '_bsontype', { value: 'ObjectID' });

	function alphabetize(str) {
	    return str.split('').sort().join('');
	}
	/**
	 * A class representation of the BSON RegExp type.
	 * @public
	 * @category BSONType
	 */
	var BSONRegExp = /** @class */ (function () {
	    /**
	     * @param pattern - The regular expression pattern to match
	     * @param options - The regular expression options
	     */
	    function BSONRegExp(pattern, options) {
	        if (!(this instanceof BSONRegExp))
	            return new BSONRegExp(pattern, options);
	        this.pattern = pattern;
	        this.options = alphabetize(options !== null && options !== void 0 ? options : '');
	        if (this.pattern.indexOf('\x00') !== -1) {
	            throw new BSONError("BSON Regex patterns cannot contain null bytes, found: ".concat(JSON.stringify(this.pattern)));
	        }
	        if (this.options.indexOf('\x00') !== -1) {
	            throw new BSONError("BSON Regex options cannot contain null bytes, found: ".concat(JSON.stringify(this.options)));
	        }
	        // Validate options
	        for (var i = 0; i < this.options.length; i++) {
	            if (!(this.options[i] === 'i' ||
	                this.options[i] === 'm' ||
	                this.options[i] === 'x' ||
	                this.options[i] === 'l' ||
	                this.options[i] === 's' ||
	                this.options[i] === 'u')) {
	                throw new BSONError("The regular expression option [".concat(this.options[i], "] is not supported"));
	            }
	        }
	    }
	    BSONRegExp.parseOptions = function (options) {
	        return options ? options.split('').sort().join('') : '';
	    };
	    /** @internal */
	    BSONRegExp.prototype.toExtendedJSON = function (options) {
	        options = options || {};
	        if (options.legacy) {
	            return { $regex: this.pattern, $options: this.options };
	        }
	        return { $regularExpression: { pattern: this.pattern, options: this.options } };
	    };
	    /** @internal */
	    BSONRegExp.fromExtendedJSON = function (doc) {
	        if ('$regex' in doc) {
	            if (typeof doc.$regex !== 'string') {
	                // This is for $regex query operators that have extended json values.
	                if (doc.$regex._bsontype === 'BSONRegExp') {
	                    return doc;
	                }
	            }
	            else {
	                return new BSONRegExp(doc.$regex, BSONRegExp.parseOptions(doc.$options));
	            }
	        }
	        if ('$regularExpression' in doc) {
	            return new BSONRegExp(doc.$regularExpression.pattern, BSONRegExp.parseOptions(doc.$regularExpression.options));
	        }
	        throw new BSONTypeError("Unexpected BSONRegExp EJSON object form: ".concat(JSON.stringify(doc)));
	    };
	    return BSONRegExp;
	}());
	Object.defineProperty(BSONRegExp.prototype, '_bsontype', { value: 'BSONRegExp' });

	/**
	 * A class representation of the BSON Symbol type.
	 * @public
	 * @category BSONType
	 */
	var BSONSymbol = /** @class */ (function () {
	    /**
	     * @param value - the string representing the symbol.
	     */
	    function BSONSymbol(value) {
	        if (!(this instanceof BSONSymbol))
	            return new BSONSymbol(value);
	        this.value = value;
	    }
	    /** Access the wrapped string value. */
	    BSONSymbol.prototype.valueOf = function () {
	        return this.value;
	    };
	    BSONSymbol.prototype.toString = function () {
	        return this.value;
	    };
	    /** @internal */
	    BSONSymbol.prototype.inspect = function () {
	        return "new BSONSymbol(\"".concat(this.value, "\")");
	    };
	    BSONSymbol.prototype.toJSON = function () {
	        return this.value;
	    };
	    /** @internal */
	    BSONSymbol.prototype.toExtendedJSON = function () {
	        return { $symbol: this.value };
	    };
	    /** @internal */
	    BSONSymbol.fromExtendedJSON = function (doc) {
	        return new BSONSymbol(doc.$symbol);
	    };
	    /** @internal */
	    BSONSymbol.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    return BSONSymbol;
	}());
	Object.defineProperty(BSONSymbol.prototype, '_bsontype', { value: 'Symbol' });

	/** @public */
	var LongWithoutOverridesClass = Long;
	/**
	 * @public
	 * @category BSONType
	 * */
	var Timestamp = /** @class */ (function (_super) {
	    __extends(Timestamp, _super);
	    function Timestamp(low, high) {
	        var _this = this;
	        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	        // @ts-expect-error
	        if (!(_this instanceof Timestamp))
	            return new Timestamp(low, high);
	        if (Long.isLong(low)) {
	            _this = _super.call(this, low.low, low.high, true) || this;
	        }
	        else if (isObjectLike(low) && typeof low.t !== 'undefined' && typeof low.i !== 'undefined') {
	            _this = _super.call(this, low.i, low.t, true) || this;
	        }
	        else {
	            _this = _super.call(this, low, high, true) || this;
	        }
	        Object.defineProperty(_this, '_bsontype', {
	            value: 'Timestamp',
	            writable: false,
	            configurable: false,
	            enumerable: false
	        });
	        return _this;
	    }
	    Timestamp.prototype.toJSON = function () {
	        return {
	            $timestamp: this.toString()
	        };
	    };
	    /** Returns a Timestamp represented by the given (32-bit) integer value. */
	    Timestamp.fromInt = function (value) {
	        return new Timestamp(Long.fromInt(value, true));
	    };
	    /** Returns a Timestamp representing the given number value, provided that it is a finite number. Otherwise, zero is returned. */
	    Timestamp.fromNumber = function (value) {
	        return new Timestamp(Long.fromNumber(value, true));
	    };
	    /**
	     * Returns a Timestamp for the given high and low bits. Each is assumed to use 32 bits.
	     *
	     * @param lowBits - the low 32-bits.
	     * @param highBits - the high 32-bits.
	     */
	    Timestamp.fromBits = function (lowBits, highBits) {
	        return new Timestamp(lowBits, highBits);
	    };
	    /**
	     * Returns a Timestamp from the given string, optionally using the given radix.
	     *
	     * @param str - the textual representation of the Timestamp.
	     * @param optRadix - the radix in which the text is written.
	     */
	    Timestamp.fromString = function (str, optRadix) {
	        return new Timestamp(Long.fromString(str, true, optRadix));
	    };
	    /** @internal */
	    Timestamp.prototype.toExtendedJSON = function () {
	        return { $timestamp: { t: this.high >>> 0, i: this.low >>> 0 } };
	    };
	    /** @internal */
	    Timestamp.fromExtendedJSON = function (doc) {
	        return new Timestamp(doc.$timestamp);
	    };
	    /** @internal */
	    Timestamp.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
	        return this.inspect();
	    };
	    Timestamp.prototype.inspect = function () {
	        return "new Timestamp({ t: ".concat(this.getHighBits(), ", i: ").concat(this.getLowBits(), " })");
	    };
	    Timestamp.MAX_VALUE = Long.MAX_UNSIGNED_VALUE;
	    return Timestamp;
	}(LongWithoutOverridesClass));

	function isBSONType(value) {
	    return (isObjectLike(value) && Reflect.has(value, '_bsontype') && typeof value._bsontype === 'string');
	}
	// INT32 boundaries
	var BSON_INT32_MAX = 0x7fffffff;
	var BSON_INT32_MIN = -0x80000000;
	// INT64 boundaries
	// const BSON_INT64_MAX = 0x7fffffffffffffff; // TODO(NODE-4377): This number cannot be precisely represented in JS
	var BSON_INT64_MAX = 0x8000000000000000;
	var BSON_INT64_MIN = -0x8000000000000000;
	// all the types where we don't need to do any special processing and can just pass the EJSON
	//straight to type.fromExtendedJSON
	var keysToCodecs = {
	    $oid: ObjectId,
	    $binary: Binary,
	    $uuid: Binary,
	    $symbol: BSONSymbol,
	    $numberInt: Int32,
	    $numberDecimal: Decimal128,
	    $numberDouble: Double,
	    $numberLong: Long,
	    $minKey: MinKey,
	    $maxKey: MaxKey,
	    $regex: BSONRegExp,
	    $regularExpression: BSONRegExp,
	    $timestamp: Timestamp
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function deserializeValue(value, options) {
	    if (options === void 0) { options = {}; }
	    if (typeof value === 'number') {
	        if (options.relaxed || options.legacy) {
	            return value;
	        }
	        // if it's an integer, should interpret as smallest BSON integer
	        // that can represent it exactly. (if out of range, interpret as double.)
	        if (Math.floor(value) === value) {
	            if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX)
	                return new Int32(value);
	            if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX)
	                return Long.fromNumber(value);
	        }
	        // If the number is a non-integer or out of integer range, should interpret as BSON Double.
	        return new Double(value);
	    }
	    // from here on out we're looking for bson types, so bail if its not an object
	    if (value == null || typeof value !== 'object')
	        return value;
	    // upgrade deprecated undefined to null
	    if (value.$undefined)
	        return null;
	    var keys = Object.keys(value).filter(function (k) { return k.startsWith('$') && value[k] != null; });
	    for (var i = 0; i < keys.length; i++) {
	        var c = keysToCodecs[keys[i]];
	        if (c)
	            return c.fromExtendedJSON(value, options);
	    }
	    if (value.$date != null) {
	        var d = value.$date;
	        var date = new Date();
	        if (options.legacy) {
	            if (typeof d === 'number')
	                date.setTime(d);
	            else if (typeof d === 'string')
	                date.setTime(Date.parse(d));
	        }
	        else {
	            if (typeof d === 'string')
	                date.setTime(Date.parse(d));
	            else if (Long.isLong(d))
	                date.setTime(d.toNumber());
	            else if (typeof d === 'number' && options.relaxed)
	                date.setTime(d);
	        }
	        return date;
	    }
	    if (value.$code != null) {
	        var copy = Object.assign({}, value);
	        if (value.$scope) {
	            copy.$scope = deserializeValue(value.$scope);
	        }
	        return Code.fromExtendedJSON(value);
	    }
	    if (isDBRefLike(value) || value.$dbPointer) {
	        var v = value.$ref ? value : value.$dbPointer;
	        // we run into this in a "degenerate EJSON" case (with $id and $ref order flipped)
	        // because of the order JSON.parse goes through the document
	        if (v instanceof DBRef)
	            return v;
	        var dollarKeys = Object.keys(v).filter(function (k) { return k.startsWith('$'); });
	        var valid_1 = true;
	        dollarKeys.forEach(function (k) {
	            if (['$ref', '$id', '$db'].indexOf(k) === -1)
	                valid_1 = false;
	        });
	        // only make DBRef if $ keys are all valid
	        if (valid_1)
	            return DBRef.fromExtendedJSON(v);
	    }
	    return value;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function serializeArray(array, options) {
	    return array.map(function (v, index) {
	        options.seenObjects.push({ propertyName: "index ".concat(index), obj: null });
	        try {
	            return serializeValue(v, options);
	        }
	        finally {
	            options.seenObjects.pop();
	        }
	    });
	}
	function getISOString(date) {
	    var isoStr = date.toISOString();
	    // we should only show milliseconds in timestamp if they're non-zero
	    return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + 'Z';
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function serializeValue(value, options) {
	    if ((typeof value === 'object' || typeof value === 'function') && value !== null) {
	        var index = options.seenObjects.findIndex(function (entry) { return entry.obj === value; });
	        if (index !== -1) {
	            var props = options.seenObjects.map(function (entry) { return entry.propertyName; });
	            var leadingPart = props
	                .slice(0, index)
	                .map(function (prop) { return "".concat(prop, " -> "); })
	                .join('');
	            var alreadySeen = props[index];
	            var circularPart = ' -> ' +
	                props
	                    .slice(index + 1, props.length - 1)
	                    .map(function (prop) { return "".concat(prop, " -> "); })
	                    .join('');
	            var current = props[props.length - 1];
	            var leadingSpace = ' '.repeat(leadingPart.length + alreadySeen.length / 2);
	            var dashes = '-'.repeat(circularPart.length + (alreadySeen.length + current.length) / 2 - 1);
	            throw new BSONTypeError('Converting circular structure to EJSON:\n' +
	                "    ".concat(leadingPart).concat(alreadySeen).concat(circularPart).concat(current, "\n") +
	                "    ".concat(leadingSpace, "\\").concat(dashes, "/"));
	        }
	        options.seenObjects[options.seenObjects.length - 1].obj = value;
	    }
	    if (Array.isArray(value))
	        return serializeArray(value, options);
	    if (value === undefined)
	        return null;
	    if (value instanceof Date || isDate(value)) {
	        var dateNum = value.getTime(), 
	        // is it in year range 1970-9999?
	        inRange = dateNum > -1 && dateNum < 253402318800000;
	        if (options.legacy) {
	            return options.relaxed && inRange
	                ? { $date: value.getTime() }
	                : { $date: getISOString(value) };
	        }
	        return options.relaxed && inRange
	            ? { $date: getISOString(value) }
	            : { $date: { $numberLong: value.getTime().toString() } };
	    }
	    if (typeof value === 'number' && (!options.relaxed || !isFinite(value))) {
	        // it's an integer
	        if (Math.floor(value) === value) {
	            var int32Range = value >= BSON_INT32_MIN && value <= BSON_INT32_MAX, int64Range = value >= BSON_INT64_MIN && value <= BSON_INT64_MAX;
	            // interpret as being of the smallest BSON integer type that can represent the number exactly
	            if (int32Range)
	                return { $numberInt: value.toString() };
	            if (int64Range)
	                return { $numberLong: value.toString() };
	        }
	        return { $numberDouble: value.toString() };
	    }
	    if (value instanceof RegExp || isRegExp(value)) {
	        var flags = value.flags;
	        if (flags === undefined) {
	            var match = value.toString().match(/[gimuy]*$/);
	            if (match) {
	                flags = match[0];
	            }
	        }
	        var rx = new BSONRegExp(value.source, flags);
	        return rx.toExtendedJSON(options);
	    }
	    if (value != null && typeof value === 'object')
	        return serializeDocument(value, options);
	    return value;
	}
	var BSON_TYPE_MAPPINGS = {
	    Binary: function (o) { return new Binary(o.value(), o.sub_type); },
	    Code: function (o) { return new Code(o.code, o.scope); },
	    DBRef: function (o) { return new DBRef(o.collection || o.namespace, o.oid, o.db, o.fields); },
	    Decimal128: function (o) { return new Decimal128(o.bytes); },
	    Double: function (o) { return new Double(o.value); },
	    Int32: function (o) { return new Int32(o.value); },
	    Long: function (o) {
	        return Long.fromBits(
	        // underscore variants for 1.x backwards compatibility
	        o.low != null ? o.low : o.low_, o.low != null ? o.high : o.high_, o.low != null ? o.unsigned : o.unsigned_);
	    },
	    MaxKey: function () { return new MaxKey(); },
	    MinKey: function () { return new MinKey(); },
	    ObjectID: function (o) { return new ObjectId(o); },
	    ObjectId: function (o) { return new ObjectId(o); },
	    BSONRegExp: function (o) { return new BSONRegExp(o.pattern, o.options); },
	    Symbol: function (o) { return new BSONSymbol(o.value); },
	    Timestamp: function (o) { return Timestamp.fromBits(o.low, o.high); }
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function serializeDocument(doc, options) {
	    if (doc == null || typeof doc !== 'object')
	        throw new BSONError('not an object instance');
	    var bsontype = doc._bsontype;
	    if (typeof bsontype === 'undefined') {
	        // It's a regular object. Recursively serialize its property values.
	        var _doc = {};
	        for (var name in doc) {
	            options.seenObjects.push({ propertyName: name, obj: null });
	            try {
	                var value = serializeValue(doc[name], options);
	                if (name === '__proto__') {
	                    Object.defineProperty(_doc, name, {
	                        value: value,
	                        writable: true,
	                        enumerable: true,
	                        configurable: true
	                    });
	                }
	                else {
	                    _doc[name] = value;
	                }
	            }
	            finally {
	                options.seenObjects.pop();
	            }
	        }
	        return _doc;
	    }
	    else if (isBSONType(doc)) {
	        // the "document" is really just a BSON type object
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        var outDoc = doc;
	        if (typeof outDoc.toExtendedJSON !== 'function') {
	            // There's no EJSON serialization function on the object. It's probably an
	            // object created by a previous version of this library (or another library)
	            // that's duck-typing objects to look like they were generated by this library).
	            // Copy the object into this library's version of that type.
	            var mapper = BSON_TYPE_MAPPINGS[doc._bsontype];
	            if (!mapper) {
	                throw new BSONTypeError('Unrecognized or invalid _bsontype: ' + doc._bsontype);
	            }
	            outDoc = mapper(outDoc);
	        }
	        // Two BSON types may have nested objects that may need to be serialized too
	        if (bsontype === 'Code' && outDoc.scope) {
	            outDoc = new Code(outDoc.code, serializeValue(outDoc.scope, options));
	        }
	        else if (bsontype === 'DBRef' && outDoc.oid) {
	            outDoc = new DBRef(serializeValue(outDoc.collection, options), serializeValue(outDoc.oid, options), serializeValue(outDoc.db, options), serializeValue(outDoc.fields, options));
	        }
	        return outDoc.toExtendedJSON(options);
	    }
	    else {
	        throw new BSONError('_bsontype must be a string, but was: ' + typeof bsontype);
	    }
	}
	/**
	 * EJSON parse / stringify API
	 * @public
	 */
	// the namespace here is used to emulate `export * as EJSON from '...'`
	// which as of now (sept 2020) api-extractor does not support
	// eslint-disable-next-line @typescript-eslint/no-namespace
	exports.EJSON = void 0;
	(function (EJSON) {
	    /**
	     * Parse an Extended JSON string, constructing the JavaScript value or object described by that
	     * string.
	     *
	     * @example
	     * ```js
	     * const { EJSON } = require('bson');
	     * const text = '{ "int32": { "$numberInt": "10" } }';
	     *
	     * // prints { int32: { [String: '10'] _bsontype: 'Int32', value: '10' } }
	     * console.log(EJSON.parse(text, { relaxed: false }));
	     *
	     * // prints { int32: 10 }
	     * console.log(EJSON.parse(text));
	     * ```
	     */
	    function parse(text, options) {
	        var finalOptions = Object.assign({}, { relaxed: true, legacy: false }, options);
	        // relaxed implies not strict
	        if (typeof finalOptions.relaxed === 'boolean')
	            finalOptions.strict = !finalOptions.relaxed;
	        if (typeof finalOptions.strict === 'boolean')
	            finalOptions.relaxed = !finalOptions.strict;
	        return JSON.parse(text, function (key, value) {
	            if (key.indexOf('\x00') !== -1) {
	                throw new BSONError("BSON Document field names cannot contain null bytes, found: ".concat(JSON.stringify(key)));
	            }
	            return deserializeValue(value, finalOptions);
	        });
	    }
	    EJSON.parse = parse;
	    /**
	     * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
	     * function is specified or optionally including only the specified properties if a replacer array
	     * is specified.
	     *
	     * @param value - The value to convert to extended JSON
	     * @param replacer - A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
	     * @param space - A String or Number object that's used to insert white space into the output JSON string for readability purposes.
	     * @param options - Optional settings
	     *
	     * @example
	     * ```js
	     * const { EJSON } = require('bson');
	     * const Int32 = require('mongodb').Int32;
	     * const doc = { int32: new Int32(10) };
	     *
	     * // prints '{"int32":{"$numberInt":"10"}}'
	     * console.log(EJSON.stringify(doc, { relaxed: false }));
	     *
	     * // prints '{"int32":10}'
	     * console.log(EJSON.stringify(doc));
	     * ```
	     */
	    function stringify(value, 
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    replacer, space, options) {
	        if (space != null && typeof space === 'object') {
	            options = space;
	            space = 0;
	        }
	        if (replacer != null && typeof replacer === 'object' && !Array.isArray(replacer)) {
	            options = replacer;
	            replacer = undefined;
	            space = 0;
	        }
	        var serializeOptions = Object.assign({ relaxed: true, legacy: false }, options, {
	            seenObjects: [{ propertyName: '(root)', obj: null }]
	        });
	        var doc = serializeValue(value, serializeOptions);
	        return JSON.stringify(doc, replacer, space);
	    }
	    EJSON.stringify = stringify;
	    /**
	     * Serializes an object to an Extended JSON string, and reparse it as a JavaScript object.
	     *
	     * @param value - The object to serialize
	     * @param options - Optional settings passed to the `stringify` function
	     */
	    function serialize(value, options) {
	        options = options || {};
	        return JSON.parse(stringify(value, options));
	    }
	    EJSON.serialize = serialize;
	    /**
	     * Deserializes an Extended JSON object into a plain JavaScript object with native/BSON types
	     *
	     * @param ejson - The Extended JSON object to deserialize
	     * @param options - Optional settings passed to the parse method
	     */
	    function deserialize(ejson, options) {
	        options = options || {};
	        return parse(JSON.stringify(ejson), options);
	    }
	    EJSON.deserialize = deserialize;
	})(exports.EJSON || (exports.EJSON = {}));

	/* eslint-disable @typescript-eslint/no-explicit-any */
	/** @public */
	exports.Map = void 0;
	var bsonGlobal = getGlobal();
	if (bsonGlobal.Map) {
	    exports.Map = bsonGlobal.Map;
	}
	else {
	    // We will return a polyfill
	    exports.Map = /** @class */ (function () {
	        function Map(array) {
	            if (array === void 0) { array = []; }
	            this._keys = [];
	            this._values = {};
	            for (var i = 0; i < array.length; i++) {
	                if (array[i] == null)
	                    continue; // skip null and undefined
	                var entry = array[i];
	                var key = entry[0];
	                var value = entry[1];
	                // Add the key to the list of keys in order
	                this._keys.push(key);
	                // Add the key and value to the values dictionary with a point
	                // to the location in the ordered keys list
	                this._values[key] = { v: value, i: this._keys.length - 1 };
	            }
	        }
	        Map.prototype.clear = function () {
	            this._keys = [];
	            this._values = {};
	        };
	        Map.prototype.delete = function (key) {
	            var value = this._values[key];
	            if (value == null)
	                return false;
	            // Delete entry
	            delete this._values[key];
	            // Remove the key from the ordered keys list
	            this._keys.splice(value.i, 1);
	            return true;
	        };
	        Map.prototype.entries = function () {
	            var _this = this;
	            var index = 0;
	            return {
	                next: function () {
	                    var key = _this._keys[index++];
	                    return {
	                        value: key !== undefined ? [key, _this._values[key].v] : undefined,
	                        done: key !== undefined ? false : true
	                    };
	                }
	            };
	        };
	        Map.prototype.forEach = function (callback, self) {
	            self = self || this;
	            for (var i = 0; i < this._keys.length; i++) {
	                var key = this._keys[i];
	                // Call the forEach callback
	                callback.call(self, this._values[key].v, key, self);
	            }
	        };
	        Map.prototype.get = function (key) {
	            return this._values[key] ? this._values[key].v : undefined;
	        };
	        Map.prototype.has = function (key) {
	            return this._values[key] != null;
	        };
	        Map.prototype.keys = function () {
	            var _this = this;
	            var index = 0;
	            return {
	                next: function () {
	                    var key = _this._keys[index++];
	                    return {
	                        value: key !== undefined ? key : undefined,
	                        done: key !== undefined ? false : true
	                    };
	                }
	            };
	        };
	        Map.prototype.set = function (key, value) {
	            if (this._values[key]) {
	                this._values[key].v = value;
	                return this;
	            }
	            // Add the key to the list of keys in order
	            this._keys.push(key);
	            // Add the key and value to the values dictionary with a point
	            // to the location in the ordered keys list
	            this._values[key] = { v: value, i: this._keys.length - 1 };
	            return this;
	        };
	        Map.prototype.values = function () {
	            var _this = this;
	            var index = 0;
	            return {
	                next: function () {
	                    var key = _this._keys[index++];
	                    return {
	                        value: key !== undefined ? _this._values[key].v : undefined,
	                        done: key !== undefined ? false : true
	                    };
	                }
	            };
	        };
	        Object.defineProperty(Map.prototype, "size", {
	            get: function () {
	                return this._keys.length;
	            },
	            enumerable: false,
	            configurable: true
	        });
	        return Map;
	    }());
	}

	function calculateObjectSize$1(object, serializeFunctions, ignoreUndefined) {
	    var totalLength = 4 + 1;
	    if (Array.isArray(object)) {
	        for (var i = 0; i < object.length; i++) {
	            totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined);
	        }
	    }
	    else {
	        // If we have toBSON defined, override the current object
	        if (typeof (object === null || object === void 0 ? void 0 : object.toBSON) === 'function') {
	            object = object.toBSON();
	        }
	        // Calculate size
	        for (var key in object) {
	            totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined);
	        }
	    }
	    return totalLength;
	}
	/** @internal */
	function calculateElement(name, 
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value, serializeFunctions, isArray, ignoreUndefined) {
	    if (serializeFunctions === void 0) { serializeFunctions = false; }
	    if (isArray === void 0) { isArray = false; }
	    if (ignoreUndefined === void 0) { ignoreUndefined = false; }
	    // If we have toBSON defined, override the current object
	    if (typeof (value === null || value === void 0 ? void 0 : value.toBSON) === 'function') {
	        value = value.toBSON();
	    }
	    switch (typeof value) {
	        case 'string':
	            return 1 + buffer_1.byteLength(name, 'utf8') + 1 + 4 + buffer_1.byteLength(value, 'utf8') + 1;
	        case 'number':
	            if (Math.floor(value) === value &&
	                value >= JS_INT_MIN &&
	                value <= JS_INT_MAX) {
	                if (value >= BSON_INT32_MIN$1 && value <= BSON_INT32_MAX$1) {
	                    // 32 bit
	                    return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (4 + 1);
	                }
	                else {
	                    return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	                }
	            }
	            else {
	                // 64 bit
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	            }
	        case 'undefined':
	            if (isArray || !ignoreUndefined)
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + 1;
	            return 0;
	        case 'boolean':
	            return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (1 + 1);
	        case 'object':
	            if (value == null || value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + 1;
	            }
	            else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (12 + 1);
	            }
	            else if (value instanceof Date || isDate(value)) {
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	            }
	            else if (ArrayBuffer.isView(value) ||
	                value instanceof ArrayBuffer ||
	                isAnyArrayBuffer(value)) {
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (1 + 4 + 1) + value.byteLength);
	            }
	            else if (value['_bsontype'] === 'Long' ||
	                value['_bsontype'] === 'Double' ||
	                value['_bsontype'] === 'Timestamp') {
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	            }
	            else if (value['_bsontype'] === 'Decimal128') {
	                return (name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (16 + 1);
	            }
	            else if (value['_bsontype'] === 'Code') {
	                // Calculate size depending on the availability of a scope
	                if (value.scope != null && Object.keys(value.scope).length > 0) {
	                    return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                        1 +
	                        4 +
	                        4 +
	                        buffer_1.byteLength(value.code.toString(), 'utf8') +
	                        1 +
	                        calculateObjectSize$1(value.scope, serializeFunctions, ignoreUndefined));
	                }
	                else {
	                    return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                        1 +
	                        4 +
	                        buffer_1.byteLength(value.code.toString(), 'utf8') +
	                        1);
	                }
	            }
	            else if (value['_bsontype'] === 'Binary') {
	                var binary = value;
	                // Check what kind of subtype we have
	                if (binary.sub_type === Binary.SUBTYPE_BYTE_ARRAY) {
	                    return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                        (binary.position + 1 + 4 + 1 + 4));
	                }
	                else {
	                    return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) + (binary.position + 1 + 4 + 1));
	                }
	            }
	            else if (value['_bsontype'] === 'Symbol') {
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                    buffer_1.byteLength(value.value, 'utf8') +
	                    4 +
	                    1 +
	                    1);
	            }
	            else if (value['_bsontype'] === 'DBRef') {
	                // Set up correct object for serialization
	                var ordered_values = Object.assign({
	                    $ref: value.collection,
	                    $id: value.oid
	                }, value.fields);
	                // Add db reference if it exists
	                if (value.db != null) {
	                    ordered_values['$db'] = value.db;
	                }
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                    1 +
	                    calculateObjectSize$1(ordered_values, serializeFunctions, ignoreUndefined));
	            }
	            else if (value instanceof RegExp || isRegExp(value)) {
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                    1 +
	                    buffer_1.byteLength(value.source, 'utf8') +
	                    1 +
	                    (value.global ? 1 : 0) +
	                    (value.ignoreCase ? 1 : 0) +
	                    (value.multiline ? 1 : 0) +
	                    1);
	            }
	            else if (value['_bsontype'] === 'BSONRegExp') {
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                    1 +
	                    buffer_1.byteLength(value.pattern, 'utf8') +
	                    1 +
	                    buffer_1.byteLength(value.options, 'utf8') +
	                    1);
	            }
	            else {
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                    calculateObjectSize$1(value, serializeFunctions, ignoreUndefined) +
	                    1);
	            }
	        case 'function':
	            // WTF for 0.4.X where typeof /someregexp/ === 'function'
	            if (value instanceof RegExp || isRegExp(value) || String.call(value) === '[object RegExp]') {
	                return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                    1 +
	                    buffer_1.byteLength(value.source, 'utf8') +
	                    1 +
	                    (value.global ? 1 : 0) +
	                    (value.ignoreCase ? 1 : 0) +
	                    (value.multiline ? 1 : 0) +
	                    1);
	            }
	            else {
	                if (serializeFunctions && value.scope != null && Object.keys(value.scope).length > 0) {
	                    return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                        1 +
	                        4 +
	                        4 +
	                        buffer_1.byteLength(normalizedFunctionString(value), 'utf8') +
	                        1 +
	                        calculateObjectSize$1(value.scope, serializeFunctions, ignoreUndefined));
	                }
	                else if (serializeFunctions) {
	                    return ((name != null ? buffer_1.byteLength(name, 'utf8') + 1 : 0) +
	                        1 +
	                        4 +
	                        buffer_1.byteLength(normalizedFunctionString(value), 'utf8') +
	                        1);
	                }
	            }
	    }
	    return 0;
	}

	var FIRST_BIT = 0x80;
	var FIRST_TWO_BITS = 0xc0;
	var FIRST_THREE_BITS = 0xe0;
	var FIRST_FOUR_BITS = 0xf0;
	var FIRST_FIVE_BITS = 0xf8;
	var TWO_BIT_CHAR = 0xc0;
	var THREE_BIT_CHAR = 0xe0;
	var FOUR_BIT_CHAR = 0xf0;
	var CONTINUING_CHAR = 0x80;
	/**
	 * Determines if the passed in bytes are valid utf8
	 * @param bytes - An array of 8-bit bytes. Must be indexable and have length property
	 * @param start - The index to start validating
	 * @param end - The index to end validating
	 */
	function validateUtf8(bytes, start, end) {
	    var continuation = 0;
	    for (var i = start; i < end; i += 1) {
	        var byte = bytes[i];
	        if (continuation) {
	            if ((byte & FIRST_TWO_BITS) !== CONTINUING_CHAR) {
	                return false;
	            }
	            continuation -= 1;
	        }
	        else if (byte & FIRST_BIT) {
	            if ((byte & FIRST_THREE_BITS) === TWO_BIT_CHAR) {
	                continuation = 1;
	            }
	            else if ((byte & FIRST_FOUR_BITS) === THREE_BIT_CHAR) {
	                continuation = 2;
	            }
	            else if ((byte & FIRST_FIVE_BITS) === FOUR_BIT_CHAR) {
	                continuation = 3;
	            }
	            else {
	                return false;
	            }
	        }
	    }
	    return !continuation;
	}

	// Internal long versions
	var JS_INT_MAX_LONG = Long.fromNumber(JS_INT_MAX);
	var JS_INT_MIN_LONG = Long.fromNumber(JS_INT_MIN);
	var functionCache = {};
	function deserialize$1(buffer, options, isArray) {
	    options = options == null ? {} : options;
	    var index = options && options.index ? options.index : 0;
	    // Read the document size
	    var size = buffer[index] |
	        (buffer[index + 1] << 8) |
	        (buffer[index + 2] << 16) |
	        (buffer[index + 3] << 24);
	    if (size < 5) {
	        throw new BSONError("bson size must be >= 5, is ".concat(size));
	    }
	    if (options.allowObjectSmallerThanBufferSize && buffer.length < size) {
	        throw new BSONError("buffer length ".concat(buffer.length, " must be >= bson size ").concat(size));
	    }
	    if (!options.allowObjectSmallerThanBufferSize && buffer.length !== size) {
	        throw new BSONError("buffer length ".concat(buffer.length, " must === bson size ").concat(size));
	    }
	    if (size + index > buffer.byteLength) {
	        throw new BSONError("(bson size ".concat(size, " + options.index ").concat(index, " must be <= buffer length ").concat(buffer.byteLength, ")"));
	    }
	    // Illegal end value
	    if (buffer[index + size - 1] !== 0) {
	        throw new BSONError("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
	    }
	    // Start deserializtion
	    return deserializeObject(buffer, index, options, isArray);
	}
	var allowedDBRefKeys = /^\$ref$|^\$id$|^\$db$/;
	function deserializeObject(buffer, index, options, isArray) {
	    if (isArray === void 0) { isArray = false; }
	    var evalFunctions = options['evalFunctions'] == null ? false : options['evalFunctions'];
	    var cacheFunctions = options['cacheFunctions'] == null ? false : options['cacheFunctions'];
	    var fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw'];
	    // Return raw bson buffer instead of parsing it
	    var raw = options['raw'] == null ? false : options['raw'];
	    // Return BSONRegExp objects instead of native regular expressions
	    var bsonRegExp = typeof options['bsonRegExp'] === 'boolean' ? options['bsonRegExp'] : false;
	    // Controls the promotion of values vs wrapper classes
	    var promoteBuffers = options['promoteBuffers'] == null ? false : options['promoteBuffers'];
	    var promoteLongs = options['promoteLongs'] == null ? true : options['promoteLongs'];
	    var promoteValues = options['promoteValues'] == null ? true : options['promoteValues'];
	    // Ensures default validation option if none given
	    var validation = options.validation == null ? { utf8: true } : options.validation;
	    // Shows if global utf-8 validation is enabled or disabled
	    var globalUTFValidation = true;
	    // Reflects utf-8 validation setting regardless of global or specific key validation
	    var validationSetting;
	    // Set of keys either to enable or disable validation on
	    var utf8KeysSet = new Set();
	    // Check for boolean uniformity and empty validation option
	    var utf8ValidatedKeys = validation.utf8;
	    if (typeof utf8ValidatedKeys === 'boolean') {
	        validationSetting = utf8ValidatedKeys;
	    }
	    else {
	        globalUTFValidation = false;
	        var utf8ValidationValues = Object.keys(utf8ValidatedKeys).map(function (key) {
	            return utf8ValidatedKeys[key];
	        });
	        if (utf8ValidationValues.length === 0) {
	            throw new BSONError('UTF-8 validation setting cannot be empty');
	        }
	        if (typeof utf8ValidationValues[0] !== 'boolean') {
	            throw new BSONError('Invalid UTF-8 validation option, must specify boolean values');
	        }
	        validationSetting = utf8ValidationValues[0];
	        // Ensures boolean uniformity in utf-8 validation (all true or all false)
	        if (!utf8ValidationValues.every(function (item) { return item === validationSetting; })) {
	            throw new BSONError('Invalid UTF-8 validation option - keys must be all true or all false');
	        }
	    }
	    // Add keys to set that will either be validated or not based on validationSetting
	    if (!globalUTFValidation) {
	        for (var _i = 0, _a = Object.keys(utf8ValidatedKeys); _i < _a.length; _i++) {
	            var key = _a[_i];
	            utf8KeysSet.add(key);
	        }
	    }
	    // Set the start index
	    var startIndex = index;
	    // Validate that we have at least 4 bytes of buffer
	    if (buffer.length < 5)
	        throw new BSONError('corrupt bson message < 5 bytes long');
	    // Read the document size
	    var size = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
	    // Ensure buffer is valid size
	    if (size < 5 || size > buffer.length)
	        throw new BSONError('corrupt bson message');
	    // Create holding object
	    var object = isArray ? [] : {};
	    // Used for arrays to skip having to perform utf8 decoding
	    var arrayIndex = 0;
	    var done = false;
	    var isPossibleDBRef = isArray ? false : null;
	    // While we have more left data left keep parsing
	    var dataview = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	    while (!done) {
	        // Read the type
	        var elementType = buffer[index++];
	        // If we get a zero it's the last byte, exit
	        if (elementType === 0)
	            break;
	        // Get the start search index
	        var i = index;
	        // Locate the end of the c string
	        while (buffer[i] !== 0x00 && i < buffer.length) {
	            i++;
	        }
	        // If are at the end of the buffer there is a problem with the document
	        if (i >= buffer.byteLength)
	            throw new BSONError('Bad BSON Document: illegal CString');
	        // Represents the key
	        var name = isArray ? arrayIndex++ : buffer.toString('utf8', index, i);
	        // shouldValidateKey is true if the key should be validated, false otherwise
	        var shouldValidateKey = true;
	        if (globalUTFValidation || utf8KeysSet.has(name)) {
	            shouldValidateKey = validationSetting;
	        }
	        else {
	            shouldValidateKey = !validationSetting;
	        }
	        if (isPossibleDBRef !== false && name[0] === '$') {
	            isPossibleDBRef = allowedDBRefKeys.test(name);
	        }
	        var value = void 0;
	        index = i + 1;
	        if (elementType === BSON_DATA_STRING) {
	            var stringSize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            if (stringSize <= 0 ||
	                stringSize > buffer.length - index ||
	                buffer[index + stringSize - 1] !== 0) {
	                throw new BSONError('bad string length in bson');
	            }
	            value = getValidatedString(buffer, index, index + stringSize - 1, shouldValidateKey);
	            index = index + stringSize;
	        }
	        else if (elementType === BSON_DATA_OID) {
	            var oid = buffer_1.alloc(12);
	            buffer.copy(oid, 0, index, index + 12);
	            value = new ObjectId(oid);
	            index = index + 12;
	        }
	        else if (elementType === BSON_DATA_INT && promoteValues === false) {
	            value = new Int32(buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24));
	        }
	        else if (elementType === BSON_DATA_INT) {
	            value =
	                buffer[index++] |
	                    (buffer[index++] << 8) |
	                    (buffer[index++] << 16) |
	                    (buffer[index++] << 24);
	        }
	        else if (elementType === BSON_DATA_NUMBER && promoteValues === false) {
	            value = new Double(dataview.getFloat64(index, true));
	            index = index + 8;
	        }
	        else if (elementType === BSON_DATA_NUMBER) {
	            value = dataview.getFloat64(index, true);
	            index = index + 8;
	        }
	        else if (elementType === BSON_DATA_DATE) {
	            var lowBits = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            var highBits = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            value = new Date(new Long(lowBits, highBits).toNumber());
	        }
	        else if (elementType === BSON_DATA_BOOLEAN) {
	            if (buffer[index] !== 0 && buffer[index] !== 1)
	                throw new BSONError('illegal boolean type value');
	            value = buffer[index++] === 1;
	        }
	        else if (elementType === BSON_DATA_OBJECT) {
	            var _index = index;
	            var objectSize = buffer[index] |
	                (buffer[index + 1] << 8) |
	                (buffer[index + 2] << 16) |
	                (buffer[index + 3] << 24);
	            if (objectSize <= 0 || objectSize > buffer.length - index)
	                throw new BSONError('bad embedded document length in bson');
	            // We have a raw value
	            if (raw) {
	                value = buffer.slice(index, index + objectSize);
	            }
	            else {
	                var objectOptions = options;
	                if (!globalUTFValidation) {
	                    objectOptions = _assign(_assign({}, options), { validation: { utf8: shouldValidateKey } });
	                }
	                value = deserializeObject(buffer, _index, objectOptions, false);
	            }
	            index = index + objectSize;
	        }
	        else if (elementType === BSON_DATA_ARRAY) {
	            var _index = index;
	            var objectSize = buffer[index] |
	                (buffer[index + 1] << 8) |
	                (buffer[index + 2] << 16) |
	                (buffer[index + 3] << 24);
	            var arrayOptions = options;
	            // Stop index
	            var stopIndex = index + objectSize;
	            // All elements of array to be returned as raw bson
	            if (fieldsAsRaw && fieldsAsRaw[name]) {
	                arrayOptions = {};
	                for (var n in options) {
	                    arrayOptions[n] = options[n];
	                }
	                arrayOptions['raw'] = true;
	            }
	            if (!globalUTFValidation) {
	                arrayOptions = _assign(_assign({}, arrayOptions), { validation: { utf8: shouldValidateKey } });
	            }
	            value = deserializeObject(buffer, _index, arrayOptions, true);
	            index = index + objectSize;
	            if (buffer[index - 1] !== 0)
	                throw new BSONError('invalid array terminator byte');
	            if (index !== stopIndex)
	                throw new BSONError('corrupted array bson');
	        }
	        else if (elementType === BSON_DATA_UNDEFINED) {
	            value = undefined;
	        }
	        else if (elementType === BSON_DATA_NULL) {
	            value = null;
	        }
	        else if (elementType === BSON_DATA_LONG) {
	            // Unpack the low and high bits
	            var lowBits = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            var highBits = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            var long = new Long(lowBits, highBits);
	            // Promote the long if possible
	            if (promoteLongs && promoteValues === true) {
	                value =
	                    long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG)
	                        ? long.toNumber()
	                        : long;
	            }
	            else {
	                value = long;
	            }
	        }
	        else if (elementType === BSON_DATA_DECIMAL128) {
	            // Buffer to contain the decimal bytes
	            var bytes = buffer_1.alloc(16);
	            // Copy the next 16 bytes into the bytes buffer
	            buffer.copy(bytes, 0, index, index + 16);
	            // Update index
	            index = index + 16;
	            // Assign the new Decimal128 value
	            var decimal128 = new Decimal128(bytes);
	            // If we have an alternative mapper use that
	            if ('toObject' in decimal128 && typeof decimal128.toObject === 'function') {
	                value = decimal128.toObject();
	            }
	            else {
	                value = decimal128;
	            }
	        }
	        else if (elementType === BSON_DATA_BINARY) {
	            var binarySize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            var totalBinarySize = binarySize;
	            var subType = buffer[index++];
	            // Did we have a negative binary size, throw
	            if (binarySize < 0)
	                throw new BSONError('Negative binary type element size found');
	            // Is the length longer than the document
	            if (binarySize > buffer.byteLength)
	                throw new BSONError('Binary type size larger than document size');
	            // Decode as raw Buffer object if options specifies it
	            if (buffer['slice'] != null) {
	                // If we have subtype 2 skip the 4 bytes for the size
	                if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
	                    binarySize =
	                        buffer[index++] |
	                            (buffer[index++] << 8) |
	                            (buffer[index++] << 16) |
	                            (buffer[index++] << 24);
	                    if (binarySize < 0)
	                        throw new BSONError('Negative binary type element size found for subtype 0x02');
	                    if (binarySize > totalBinarySize - 4)
	                        throw new BSONError('Binary type with subtype 0x02 contains too long binary size');
	                    if (binarySize < totalBinarySize - 4)
	                        throw new BSONError('Binary type with subtype 0x02 contains too short binary size');
	                }
	                if (promoteBuffers && promoteValues) {
	                    value = buffer.slice(index, index + binarySize);
	                }
	                else {
	                    value = new Binary(buffer.slice(index, index + binarySize), subType);
	                    if (subType === BSON_BINARY_SUBTYPE_UUID_NEW) {
	                        value = value.toUUID();
	                    }
	                }
	            }
	            else {
	                var _buffer = buffer_1.alloc(binarySize);
	                // If we have subtype 2 skip the 4 bytes for the size
	                if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
	                    binarySize =
	                        buffer[index++] |
	                            (buffer[index++] << 8) |
	                            (buffer[index++] << 16) |
	                            (buffer[index++] << 24);
	                    if (binarySize < 0)
	                        throw new BSONError('Negative binary type element size found for subtype 0x02');
	                    if (binarySize > totalBinarySize - 4)
	                        throw new BSONError('Binary type with subtype 0x02 contains too long binary size');
	                    if (binarySize < totalBinarySize - 4)
	                        throw new BSONError('Binary type with subtype 0x02 contains too short binary size');
	                }
	                // Copy the data
	                for (i = 0; i < binarySize; i++) {
	                    _buffer[i] = buffer[index + i];
	                }
	                if (promoteBuffers && promoteValues) {
	                    value = _buffer;
	                }
	                else if (subType === BSON_BINARY_SUBTYPE_UUID_NEW) {
	                    value = new Binary(buffer.slice(index, index + binarySize), subType).toUUID();
	                }
	                else {
	                    value = new Binary(buffer.slice(index, index + binarySize), subType);
	                }
	            }
	            // Update the index
	            index = index + binarySize;
	        }
	        else if (elementType === BSON_DATA_REGEXP && bsonRegExp === false) {
	            // Get the start search index
	            i = index;
	            // Locate the end of the c string
	            while (buffer[i] !== 0x00 && i < buffer.length) {
	                i++;
	            }
	            // If are at the end of the buffer there is a problem with the document
	            if (i >= buffer.length)
	                throw new BSONError('Bad BSON Document: illegal CString');
	            // Return the C string
	            var source = buffer.toString('utf8', index, i);
	            // Create the regexp
	            index = i + 1;
	            // Get the start search index
	            i = index;
	            // Locate the end of the c string
	            while (buffer[i] !== 0x00 && i < buffer.length) {
	                i++;
	            }
	            // If are at the end of the buffer there is a problem with the document
	            if (i >= buffer.length)
	                throw new BSONError('Bad BSON Document: illegal CString');
	            // Return the C string
	            var regExpOptions = buffer.toString('utf8', index, i);
	            index = i + 1;
	            // For each option add the corresponding one for javascript
	            var optionsArray = new Array(regExpOptions.length);
	            // Parse options
	            for (i = 0; i < regExpOptions.length; i++) {
	                switch (regExpOptions[i]) {
	                    case 'm':
	                        optionsArray[i] = 'm';
	                        break;
	                    case 's':
	                        optionsArray[i] = 'g';
	                        break;
	                    case 'i':
	                        optionsArray[i] = 'i';
	                        break;
	                }
	            }
	            value = new RegExp(source, optionsArray.join(''));
	        }
	        else if (elementType === BSON_DATA_REGEXP && bsonRegExp === true) {
	            // Get the start search index
	            i = index;
	            // Locate the end of the c string
	            while (buffer[i] !== 0x00 && i < buffer.length) {
	                i++;
	            }
	            // If are at the end of the buffer there is a problem with the document
	            if (i >= buffer.length)
	                throw new BSONError('Bad BSON Document: illegal CString');
	            // Return the C string
	            var source = buffer.toString('utf8', index, i);
	            index = i + 1;
	            // Get the start search index
	            i = index;
	            // Locate the end of the c string
	            while (buffer[i] !== 0x00 && i < buffer.length) {
	                i++;
	            }
	            // If are at the end of the buffer there is a problem with the document
	            if (i >= buffer.length)
	                throw new BSONError('Bad BSON Document: illegal CString');
	            // Return the C string
	            var regExpOptions = buffer.toString('utf8', index, i);
	            index = i + 1;
	            // Set the object
	            value = new BSONRegExp(source, regExpOptions);
	        }
	        else if (elementType === BSON_DATA_SYMBOL) {
	            var stringSize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            if (stringSize <= 0 ||
	                stringSize > buffer.length - index ||
	                buffer[index + stringSize - 1] !== 0) {
	                throw new BSONError('bad string length in bson');
	            }
	            var symbol = getValidatedString(buffer, index, index + stringSize - 1, shouldValidateKey);
	            value = promoteValues ? symbol : new BSONSymbol(symbol);
	            index = index + stringSize;
	        }
	        else if (elementType === BSON_DATA_TIMESTAMP) {
	            var lowBits = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            var highBits = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            value = new Timestamp(lowBits, highBits);
	        }
	        else if (elementType === BSON_DATA_MIN_KEY) {
	            value = new MinKey();
	        }
	        else if (elementType === BSON_DATA_MAX_KEY) {
	            value = new MaxKey();
	        }
	        else if (elementType === BSON_DATA_CODE) {
	            var stringSize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            if (stringSize <= 0 ||
	                stringSize > buffer.length - index ||
	                buffer[index + stringSize - 1] !== 0) {
	                throw new BSONError('bad string length in bson');
	            }
	            var functionString = getValidatedString(buffer, index, index + stringSize - 1, shouldValidateKey);
	            // If we are evaluating the functions
	            if (evalFunctions) {
	                // If we have cache enabled let's look for the md5 of the function in the cache
	                if (cacheFunctions) {
	                    // Got to do this to avoid V8 deoptimizing the call due to finding eval
	                    value = isolateEval(functionString, functionCache, object);
	                }
	                else {
	                    value = isolateEval(functionString);
	                }
	            }
	            else {
	                value = new Code(functionString);
	            }
	            // Update parse index position
	            index = index + stringSize;
	        }
	        else if (elementType === BSON_DATA_CODE_W_SCOPE) {
	            var totalSize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            // Element cannot be shorter than totalSize + stringSize + documentSize + terminator
	            if (totalSize < 4 + 4 + 4 + 1) {
	                throw new BSONError('code_w_scope total size shorter minimum expected length');
	            }
	            // Get the code string size
	            var stringSize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            // Check if we have a valid string
	            if (stringSize <= 0 ||
	                stringSize > buffer.length - index ||
	                buffer[index + stringSize - 1] !== 0) {
	                throw new BSONError('bad string length in bson');
	            }
	            // Javascript function
	            var functionString = getValidatedString(buffer, index, index + stringSize - 1, shouldValidateKey);
	            // Update parse index position
	            index = index + stringSize;
	            // Parse the element
	            var _index = index;
	            // Decode the size of the object document
	            var objectSize = buffer[index] |
	                (buffer[index + 1] << 8) |
	                (buffer[index + 2] << 16) |
	                (buffer[index + 3] << 24);
	            // Decode the scope object
	            var scopeObject = deserializeObject(buffer, _index, options, false);
	            // Adjust the index
	            index = index + objectSize;
	            // Check if field length is too short
	            if (totalSize < 4 + 4 + objectSize + stringSize) {
	                throw new BSONError('code_w_scope total size is too short, truncating scope');
	            }
	            // Check if totalSize field is too long
	            if (totalSize > 4 + 4 + objectSize + stringSize) {
	                throw new BSONError('code_w_scope total size is too long, clips outer document');
	            }
	            // If we are evaluating the functions
	            if (evalFunctions) {
	                // If we have cache enabled let's look for the md5 of the function in the cache
	                if (cacheFunctions) {
	                    // Got to do this to avoid V8 deoptimizing the call due to finding eval
	                    value = isolateEval(functionString, functionCache, object);
	                }
	                else {
	                    value = isolateEval(functionString);
	                }
	                value.scope = scopeObject;
	            }
	            else {
	                value = new Code(functionString, scopeObject);
	            }
	        }
	        else if (elementType === BSON_DATA_DBPOINTER) {
	            // Get the code string size
	            var stringSize = buffer[index++] |
	                (buffer[index++] << 8) |
	                (buffer[index++] << 16) |
	                (buffer[index++] << 24);
	            // Check if we have a valid string
	            if (stringSize <= 0 ||
	                stringSize > buffer.length - index ||
	                buffer[index + stringSize - 1] !== 0)
	                throw new BSONError('bad string length in bson');
	            // Namespace
	            if (validation != null && validation.utf8) {
	                if (!validateUtf8(buffer, index, index + stringSize - 1)) {
	                    throw new BSONError('Invalid UTF-8 string in BSON document');
	                }
	            }
	            var namespace = buffer.toString('utf8', index, index + stringSize - 1);
	            // Update parse index position
	            index = index + stringSize;
	            // Read the oid
	            var oidBuffer = buffer_1.alloc(12);
	            buffer.copy(oidBuffer, 0, index, index + 12);
	            var oid = new ObjectId(oidBuffer);
	            // Update the index
	            index = index + 12;
	            // Upgrade to DBRef type
	            value = new DBRef(namespace, oid);
	        }
	        else {
	            throw new BSONError("Detected unknown BSON type ".concat(elementType.toString(16), " for fieldname \"").concat(name, "\""));
	        }
	        if (name === '__proto__') {
	            Object.defineProperty(object, name, {
	                value: value,
	                writable: true,
	                enumerable: true,
	                configurable: true
	            });
	        }
	        else {
	            object[name] = value;
	        }
	    }
	    // Check if the deserialization was against a valid array/object
	    if (size !== index - startIndex) {
	        if (isArray)
	            throw new BSONError('corrupt array bson');
	        throw new BSONError('corrupt object bson');
	    }
	    // if we did not find "$ref", "$id", "$db", or found an extraneous $key, don't make a DBRef
	    if (!isPossibleDBRef)
	        return object;
	    if (isDBRefLike(object)) {
	        var copy = Object.assign({}, object);
	        delete copy.$ref;
	        delete copy.$id;
	        delete copy.$db;
	        return new DBRef(object.$ref, object.$id, object.$db, copy);
	    }
	    return object;
	}
	/**
	 * Ensure eval is isolated, store the result in functionCache.
	 *
	 * @internal
	 */
	function isolateEval(functionString, functionCache, object) {
	    // eslint-disable-next-line @typescript-eslint/no-implied-eval
	    if (!functionCache)
	        return new Function(functionString);
	    // Check for cache hit, eval if missing and return cached function
	    if (functionCache[functionString] == null) {
	        // eslint-disable-next-line @typescript-eslint/no-implied-eval
	        functionCache[functionString] = new Function(functionString);
	    }
	    // Set the object
	    return functionCache[functionString].bind(object);
	}
	function getValidatedString(buffer, start, end, shouldValidateUtf8) {
	    var value = buffer.toString('utf8', start, end);
	    // if utf8 validation is on, do the check
	    if (shouldValidateUtf8) {
	        for (var i = 0; i < value.length; i++) {
	            if (value.charCodeAt(i) === 0xfffd) {
	                if (!validateUtf8(buffer, start, end)) {
	                    throw new BSONError('Invalid UTF-8 string in BSON document');
	                }
	                break;
	            }
	        }
	    }
	    return value;
	}

	var regexp = /\x00/; // eslint-disable-line no-control-regex
	var ignoreKeys = new Set(['$db', '$ref', '$id', '$clusterTime']);
	/*
	 * isArray indicates if we are writing to a BSON array (type 0x04)
	 * which forces the "key" which really an array index as a string to be written as ascii
	 * This will catch any errors in index as a string generation
	 */
	function serializeString(buffer, key, value, index, isArray) {
	    // Encode String type
	    buffer[index++] = BSON_DATA_STRING;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes + 1;
	    buffer[index - 1] = 0;
	    // Write the string
	    var size = buffer.write(value, index + 4, undefined, 'utf8');
	    // Write the size of the string to buffer
	    buffer[index + 3] = ((size + 1) >> 24) & 0xff;
	    buffer[index + 2] = ((size + 1) >> 16) & 0xff;
	    buffer[index + 1] = ((size + 1) >> 8) & 0xff;
	    buffer[index] = (size + 1) & 0xff;
	    // Update index
	    index = index + 4 + size;
	    // Write zero
	    buffer[index++] = 0;
	    return index;
	}
	var SPACE_FOR_FLOAT64 = new Uint8Array(8);
	var DV_FOR_FLOAT64 = new DataView(SPACE_FOR_FLOAT64.buffer, SPACE_FOR_FLOAT64.byteOffset, SPACE_FOR_FLOAT64.byteLength);
	function serializeNumber(buffer, key, value, index, isArray) {
	    // We have an integer value
	    // TODO(NODE-2529): Add support for big int
	    if (Number.isInteger(value) &&
	        value >= BSON_INT32_MIN$1 &&
	        value <= BSON_INT32_MAX$1) {
	        // If the value fits in 32 bits encode as int32
	        // Set int type 32 bits or less
	        buffer[index++] = BSON_DATA_INT;
	        // Number of written bytes
	        var numberOfWrittenBytes = !isArray
	            ? buffer.write(key, index, undefined, 'utf8')
	            : buffer.write(key, index, undefined, 'ascii');
	        // Encode the name
	        index = index + numberOfWrittenBytes;
	        buffer[index++] = 0;
	        // Write the int value
	        buffer[index++] = value & 0xff;
	        buffer[index++] = (value >> 8) & 0xff;
	        buffer[index++] = (value >> 16) & 0xff;
	        buffer[index++] = (value >> 24) & 0xff;
	    }
	    else {
	        // Encode as double
	        buffer[index++] = BSON_DATA_NUMBER;
	        // Number of written bytes
	        var numberOfWrittenBytes = !isArray
	            ? buffer.write(key, index, undefined, 'utf8')
	            : buffer.write(key, index, undefined, 'ascii');
	        // Encode the name
	        index = index + numberOfWrittenBytes;
	        buffer[index++] = 0;
	        // Write float
	        DV_FOR_FLOAT64.setFloat64(0, value, true);
	        buffer.set(SPACE_FOR_FLOAT64, index);
	        // Adjust index
	        index = index + 8;
	    }
	    return index;
	}
	function serializeNull(buffer, key, _, index, isArray) {
	    // Set long type
	    buffer[index++] = BSON_DATA_NULL;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    return index;
	}
	function serializeBoolean(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_BOOLEAN;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Encode the boolean value
	    buffer[index++] = value ? 1 : 0;
	    return index;
	}
	function serializeDate(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_DATE;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write the date
	    var dateInMilis = Long.fromNumber(value.getTime());
	    var lowBits = dateInMilis.getLowBits();
	    var highBits = dateInMilis.getHighBits();
	    // Encode low bits
	    buffer[index++] = lowBits & 0xff;
	    buffer[index++] = (lowBits >> 8) & 0xff;
	    buffer[index++] = (lowBits >> 16) & 0xff;
	    buffer[index++] = (lowBits >> 24) & 0xff;
	    // Encode high bits
	    buffer[index++] = highBits & 0xff;
	    buffer[index++] = (highBits >> 8) & 0xff;
	    buffer[index++] = (highBits >> 16) & 0xff;
	    buffer[index++] = (highBits >> 24) & 0xff;
	    return index;
	}
	function serializeRegExp(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_REGEXP;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    if (value.source && value.source.match(regexp) != null) {
	        throw Error('value ' + value.source + ' must not contain null bytes');
	    }
	    // Adjust the index
	    index = index + buffer.write(value.source, index, undefined, 'utf8');
	    // Write zero
	    buffer[index++] = 0x00;
	    // Write the parameters
	    if (value.ignoreCase)
	        buffer[index++] = 0x69; // i
	    if (value.global)
	        buffer[index++] = 0x73; // s
	    if (value.multiline)
	        buffer[index++] = 0x6d; // m
	    // Add ending zero
	    buffer[index++] = 0x00;
	    return index;
	}
	function serializeBSONRegExp(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_REGEXP;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Check the pattern for 0 bytes
	    if (value.pattern.match(regexp) != null) {
	        // The BSON spec doesn't allow keys with null bytes because keys are
	        // null-terminated.
	        throw Error('pattern ' + value.pattern + ' must not contain null bytes');
	    }
	    // Adjust the index
	    index = index + buffer.write(value.pattern, index, undefined, 'utf8');
	    // Write zero
	    buffer[index++] = 0x00;
	    // Write the options
	    index = index + buffer.write(value.options.split('').sort().join(''), index, undefined, 'utf8');
	    // Add ending zero
	    buffer[index++] = 0x00;
	    return index;
	}
	function serializeMinMax(buffer, key, value, index, isArray) {
	    // Write the type of either min or max key
	    if (value === null) {
	        buffer[index++] = BSON_DATA_NULL;
	    }
	    else if (value._bsontype === 'MinKey') {
	        buffer[index++] = BSON_DATA_MIN_KEY;
	    }
	    else {
	        buffer[index++] = BSON_DATA_MAX_KEY;
	    }
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    return index;
	}
	function serializeObjectId(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_OID;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write the objectId into the shared buffer
	    if (typeof value.id === 'string') {
	        buffer.write(value.id, index, undefined, 'binary');
	    }
	    else if (isUint8Array(value.id)) {
	        // Use the standard JS methods here because buffer.copy() is buggy with the
	        // browser polyfill
	        buffer.set(value.id.subarray(0, 12), index);
	    }
	    else {
	        throw new BSONTypeError('object [' + JSON.stringify(value) + '] is not a valid ObjectId');
	    }
	    // Adjust index
	    return index + 12;
	}
	function serializeBuffer(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_BINARY;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Get size of the buffer (current write point)
	    var size = value.length;
	    // Write the size of the string to buffer
	    buffer[index++] = size & 0xff;
	    buffer[index++] = (size >> 8) & 0xff;
	    buffer[index++] = (size >> 16) & 0xff;
	    buffer[index++] = (size >> 24) & 0xff;
	    // Write the default subtype
	    buffer[index++] = BSON_BINARY_SUBTYPE_DEFAULT;
	    // Copy the content form the binary field to the buffer
	    buffer.set(ensureBuffer(value), index);
	    // Adjust the index
	    index = index + size;
	    return index;
	}
	function serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray, path) {
	    if (checkKeys === void 0) { checkKeys = false; }
	    if (depth === void 0) { depth = 0; }
	    if (serializeFunctions === void 0) { serializeFunctions = false; }
	    if (ignoreUndefined === void 0) { ignoreUndefined = true; }
	    if (isArray === void 0) { isArray = false; }
	    if (path === void 0) { path = []; }
	    for (var i = 0; i < path.length; i++) {
	        if (path[i] === value)
	            throw new BSONError('cyclic dependency detected');
	    }
	    // Push value to stack
	    path.push(value);
	    // Write the type
	    buffer[index++] = Array.isArray(value) ? BSON_DATA_ARRAY : BSON_DATA_OBJECT;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    var endIndex = serializeInto(buffer, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
	    // Pop stack
	    path.pop();
	    return endIndex;
	}
	function serializeDecimal128(buffer, key, value, index, isArray) {
	    buffer[index++] = BSON_DATA_DECIMAL128;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write the data from the value
	    // Prefer the standard JS methods because their typechecking is not buggy,
	    // unlike the `buffer` polyfill's.
	    buffer.set(value.bytes.subarray(0, 16), index);
	    return index + 16;
	}
	function serializeLong(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] =
	        value._bsontype === 'Long' ? BSON_DATA_LONG : BSON_DATA_TIMESTAMP;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write the date
	    var lowBits = value.getLowBits();
	    var highBits = value.getHighBits();
	    // Encode low bits
	    buffer[index++] = lowBits & 0xff;
	    buffer[index++] = (lowBits >> 8) & 0xff;
	    buffer[index++] = (lowBits >> 16) & 0xff;
	    buffer[index++] = (lowBits >> 24) & 0xff;
	    // Encode high bits
	    buffer[index++] = highBits & 0xff;
	    buffer[index++] = (highBits >> 8) & 0xff;
	    buffer[index++] = (highBits >> 16) & 0xff;
	    buffer[index++] = (highBits >> 24) & 0xff;
	    return index;
	}
	function serializeInt32(buffer, key, value, index, isArray) {
	    value = value.valueOf();
	    // Set int type 32 bits or less
	    buffer[index++] = BSON_DATA_INT;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write the int value
	    buffer[index++] = value & 0xff;
	    buffer[index++] = (value >> 8) & 0xff;
	    buffer[index++] = (value >> 16) & 0xff;
	    buffer[index++] = (value >> 24) & 0xff;
	    return index;
	}
	function serializeDouble(buffer, key, value, index, isArray) {
	    // Encode as double
	    buffer[index++] = BSON_DATA_NUMBER;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write float
	    DV_FOR_FLOAT64.setFloat64(0, value.value, true);
	    buffer.set(SPACE_FOR_FLOAT64, index);
	    // Adjust index
	    index = index + 8;
	    return index;
	}
	function serializeFunction(buffer, key, value, index, _checkKeys, _depth, isArray) {
	    buffer[index++] = BSON_DATA_CODE;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Function string
	    var functionString = normalizedFunctionString(value);
	    // Write the string
	    var size = buffer.write(functionString, index + 4, undefined, 'utf8') + 1;
	    // Write the size of the string to buffer
	    buffer[index] = size & 0xff;
	    buffer[index + 1] = (size >> 8) & 0xff;
	    buffer[index + 2] = (size >> 16) & 0xff;
	    buffer[index + 3] = (size >> 24) & 0xff;
	    // Update index
	    index = index + 4 + size - 1;
	    // Write zero
	    buffer[index++] = 0;
	    return index;
	}
	function serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray) {
	    if (checkKeys === void 0) { checkKeys = false; }
	    if (depth === void 0) { depth = 0; }
	    if (serializeFunctions === void 0) { serializeFunctions = false; }
	    if (ignoreUndefined === void 0) { ignoreUndefined = true; }
	    if (isArray === void 0) { isArray = false; }
	    if (value.scope && typeof value.scope === 'object') {
	        // Write the type
	        buffer[index++] = BSON_DATA_CODE_W_SCOPE;
	        // Number of written bytes
	        var numberOfWrittenBytes = !isArray
	            ? buffer.write(key, index, undefined, 'utf8')
	            : buffer.write(key, index, undefined, 'ascii');
	        // Encode the name
	        index = index + numberOfWrittenBytes;
	        buffer[index++] = 0;
	        // Starting index
	        var startIndex = index;
	        // Serialize the function
	        // Get the function string
	        var functionString = typeof value.code === 'string' ? value.code : value.code.toString();
	        // Index adjustment
	        index = index + 4;
	        // Write string into buffer
	        var codeSize = buffer.write(functionString, index + 4, undefined, 'utf8') + 1;
	        // Write the size of the string to buffer
	        buffer[index] = codeSize & 0xff;
	        buffer[index + 1] = (codeSize >> 8) & 0xff;
	        buffer[index + 2] = (codeSize >> 16) & 0xff;
	        buffer[index + 3] = (codeSize >> 24) & 0xff;
	        // Write end 0
	        buffer[index + 4 + codeSize - 1] = 0;
	        // Write the
	        index = index + codeSize + 4;
	        //
	        // Serialize the scope value
	        var endIndex = serializeInto(buffer, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined);
	        index = endIndex - 1;
	        // Writ the total
	        var totalSize = endIndex - startIndex;
	        // Write the total size of the object
	        buffer[startIndex++] = totalSize & 0xff;
	        buffer[startIndex++] = (totalSize >> 8) & 0xff;
	        buffer[startIndex++] = (totalSize >> 16) & 0xff;
	        buffer[startIndex++] = (totalSize >> 24) & 0xff;
	        // Write trailing zero
	        buffer[index++] = 0;
	    }
	    else {
	        buffer[index++] = BSON_DATA_CODE;
	        // Number of written bytes
	        var numberOfWrittenBytes = !isArray
	            ? buffer.write(key, index, undefined, 'utf8')
	            : buffer.write(key, index, undefined, 'ascii');
	        // Encode the name
	        index = index + numberOfWrittenBytes;
	        buffer[index++] = 0;
	        // Function string
	        var functionString = value.code.toString();
	        // Write the string
	        var size = buffer.write(functionString, index + 4, undefined, 'utf8') + 1;
	        // Write the size of the string to buffer
	        buffer[index] = size & 0xff;
	        buffer[index + 1] = (size >> 8) & 0xff;
	        buffer[index + 2] = (size >> 16) & 0xff;
	        buffer[index + 3] = (size >> 24) & 0xff;
	        // Update index
	        index = index + 4 + size - 1;
	        // Write zero
	        buffer[index++] = 0;
	    }
	    return index;
	}
	function serializeBinary(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_BINARY;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Extract the buffer
	    var data = value.value(true);
	    // Calculate size
	    var size = value.position;
	    // Add the deprecated 02 type 4 bytes of size to total
	    if (value.sub_type === Binary.SUBTYPE_BYTE_ARRAY)
	        size = size + 4;
	    // Write the size of the string to buffer
	    buffer[index++] = size & 0xff;
	    buffer[index++] = (size >> 8) & 0xff;
	    buffer[index++] = (size >> 16) & 0xff;
	    buffer[index++] = (size >> 24) & 0xff;
	    // Write the subtype to the buffer
	    buffer[index++] = value.sub_type;
	    // If we have binary type 2 the 4 first bytes are the size
	    if (value.sub_type === Binary.SUBTYPE_BYTE_ARRAY) {
	        size = size - 4;
	        buffer[index++] = size & 0xff;
	        buffer[index++] = (size >> 8) & 0xff;
	        buffer[index++] = (size >> 16) & 0xff;
	        buffer[index++] = (size >> 24) & 0xff;
	    }
	    // Write the data to the object
	    buffer.set(data, index);
	    // Adjust the index
	    index = index + value.position;
	    return index;
	}
	function serializeSymbol(buffer, key, value, index, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_SYMBOL;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    // Write the string
	    var size = buffer.write(value.value, index + 4, undefined, 'utf8') + 1;
	    // Write the size of the string to buffer
	    buffer[index] = size & 0xff;
	    buffer[index + 1] = (size >> 8) & 0xff;
	    buffer[index + 2] = (size >> 16) & 0xff;
	    buffer[index + 3] = (size >> 24) & 0xff;
	    // Update index
	    index = index + 4 + size - 1;
	    // Write zero
	    buffer[index++] = 0x00;
	    return index;
	}
	function serializeDBRef(buffer, key, value, index, depth, serializeFunctions, isArray) {
	    // Write the type
	    buffer[index++] = BSON_DATA_OBJECT;
	    // Number of written bytes
	    var numberOfWrittenBytes = !isArray
	        ? buffer.write(key, index, undefined, 'utf8')
	        : buffer.write(key, index, undefined, 'ascii');
	    // Encode the name
	    index = index + numberOfWrittenBytes;
	    buffer[index++] = 0;
	    var startIndex = index;
	    var output = {
	        $ref: value.collection || value.namespace,
	        $id: value.oid
	    };
	    if (value.db != null) {
	        output.$db = value.db;
	    }
	    output = Object.assign(output, value.fields);
	    var endIndex = serializeInto(buffer, output, false, index, depth + 1, serializeFunctions);
	    // Calculate object size
	    var size = endIndex - startIndex;
	    // Write the size
	    buffer[startIndex++] = size & 0xff;
	    buffer[startIndex++] = (size >> 8) & 0xff;
	    buffer[startIndex++] = (size >> 16) & 0xff;
	    buffer[startIndex++] = (size >> 24) & 0xff;
	    // Set index
	    return endIndex;
	}
	function serializeInto(buffer, object, checkKeys, startingIndex, depth, serializeFunctions, ignoreUndefined, path) {
	    if (checkKeys === void 0) { checkKeys = false; }
	    if (startingIndex === void 0) { startingIndex = 0; }
	    if (depth === void 0) { depth = 0; }
	    if (serializeFunctions === void 0) { serializeFunctions = false; }
	    if (ignoreUndefined === void 0) { ignoreUndefined = true; }
	    if (path === void 0) { path = []; }
	    startingIndex = startingIndex || 0;
	    path = path || [];
	    // Push the object to the path
	    path.push(object);
	    // Start place to serialize into
	    var index = startingIndex + 4;
	    // Special case isArray
	    if (Array.isArray(object)) {
	        // Get object keys
	        for (var i = 0; i < object.length; i++) {
	            var key = "".concat(i);
	            var value = object[i];
	            // Is there an override value
	            if (typeof (value === null || value === void 0 ? void 0 : value.toBSON) === 'function') {
	                value = value.toBSON();
	            }
	            if (typeof value === 'string') {
	                index = serializeString(buffer, key, value, index, true);
	            }
	            else if (typeof value === 'number') {
	                index = serializeNumber(buffer, key, value, index, true);
	            }
	            else if (typeof value === 'bigint') {
	                throw new BSONTypeError('Unsupported type BigInt, please use Decimal128');
	            }
	            else if (typeof value === 'boolean') {
	                index = serializeBoolean(buffer, key, value, index, true);
	            }
	            else if (value instanceof Date || isDate(value)) {
	                index = serializeDate(buffer, key, value, index, true);
	            }
	            else if (value === undefined) {
	                index = serializeNull(buffer, key, value, index, true);
	            }
	            else if (value === null) {
	                index = serializeNull(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	                index = serializeObjectId(buffer, key, value, index, true);
	            }
	            else if (isUint8Array(value)) {
	                index = serializeBuffer(buffer, key, value, index, true);
	            }
	            else if (value instanceof RegExp || isRegExp(value)) {
	                index = serializeRegExp(buffer, key, value, index, true);
	            }
	            else if (typeof value === 'object' && value['_bsontype'] == null) {
	                index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true, path);
	            }
	            else if (typeof value === 'object' &&
	                isBSONType(value) &&
	                value._bsontype === 'Decimal128') {
	                index = serializeDecimal128(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Timestamp') {
	                index = serializeLong(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'Double') {
	                index = serializeDouble(buffer, key, value, index, true);
	            }
	            else if (typeof value === 'function' && serializeFunctions) {
	                index = serializeFunction(buffer, key, value, index, checkKeys, depth, true);
	            }
	            else if (value['_bsontype'] === 'Code') {
	                index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true);
	            }
	            else if (value['_bsontype'] === 'Binary') {
	                index = serializeBinary(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'Symbol') {
	                index = serializeSymbol(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'DBRef') {
	                index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions, true);
	            }
	            else if (value['_bsontype'] === 'BSONRegExp') {
	                index = serializeBSONRegExp(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'Int32') {
	                index = serializeInt32(buffer, key, value, index, true);
	            }
	            else if (value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	                index = serializeMinMax(buffer, key, value, index, true);
	            }
	            else if (typeof value['_bsontype'] !== 'undefined') {
	                throw new BSONTypeError("Unrecognized or invalid _bsontype: ".concat(String(value['_bsontype'])));
	            }
	        }
	    }
	    else if (object instanceof exports.Map || isMap(object)) {
	        var iterator = object.entries();
	        var done = false;
	        while (!done) {
	            // Unpack the next entry
	            var entry = iterator.next();
	            done = !!entry.done;
	            // Are we done, then skip and terminate
	            if (done)
	                continue;
	            // Get the entry values
	            var key = entry.value[0];
	            var value = entry.value[1];
	            // Check the type of the value
	            var type = typeof value;
	            // Check the key and throw error if it's illegal
	            if (typeof key === 'string' && !ignoreKeys.has(key)) {
	                if (key.match(regexp) != null) {
	                    // The BSON spec doesn't allow keys with null bytes because keys are
	                    // null-terminated.
	                    throw Error('key ' + key + ' must not contain null bytes');
	                }
	                if (checkKeys) {
	                    if ('$' === key[0]) {
	                        throw Error('key ' + key + " must not start with '$'");
	                    }
	                    else if (~key.indexOf('.')) {
	                        throw Error('key ' + key + " must not contain '.'");
	                    }
	                }
	            }
	            if (type === 'string') {
	                index = serializeString(buffer, key, value, index);
	            }
	            else if (type === 'number') {
	                index = serializeNumber(buffer, key, value, index);
	            }
	            else if (type === 'bigint' || isBigInt64Array(value) || isBigUInt64Array(value)) {
	                throw new BSONTypeError('Unsupported type BigInt, please use Decimal128');
	            }
	            else if (type === 'boolean') {
	                index = serializeBoolean(buffer, key, value, index);
	            }
	            else if (value instanceof Date || isDate(value)) {
	                index = serializeDate(buffer, key, value, index);
	            }
	            else if (value === null || (value === undefined && ignoreUndefined === false)) {
	                index = serializeNull(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	                index = serializeObjectId(buffer, key, value, index);
	            }
	            else if (isUint8Array(value)) {
	                index = serializeBuffer(buffer, key, value, index);
	            }
	            else if (value instanceof RegExp || isRegExp(value)) {
	                index = serializeRegExp(buffer, key, value, index);
	            }
	            else if (type === 'object' && value['_bsontype'] == null) {
	                index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
	            }
	            else if (type === 'object' && value['_bsontype'] === 'Decimal128') {
	                index = serializeDecimal128(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Timestamp') {
	                index = serializeLong(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Double') {
	                index = serializeDouble(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Code') {
	                index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
	            }
	            else if (typeof value === 'function' && serializeFunctions) {
	                index = serializeFunction(buffer, key, value, index, checkKeys, depth, serializeFunctions);
	            }
	            else if (value['_bsontype'] === 'Binary') {
	                index = serializeBinary(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Symbol') {
	                index = serializeSymbol(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'DBRef') {
	                index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions);
	            }
	            else if (value['_bsontype'] === 'BSONRegExp') {
	                index = serializeBSONRegExp(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Int32') {
	                index = serializeInt32(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	                index = serializeMinMax(buffer, key, value, index);
	            }
	            else if (typeof value['_bsontype'] !== 'undefined') {
	                throw new BSONTypeError("Unrecognized or invalid _bsontype: ".concat(String(value['_bsontype'])));
	            }
	        }
	    }
	    else {
	        if (typeof (object === null || object === void 0 ? void 0 : object.toBSON) === 'function') {
	            // Provided a custom serialization method
	            object = object.toBSON();
	            if (object != null && typeof object !== 'object') {
	                throw new BSONTypeError('toBSON function did not return an object');
	            }
	        }
	        // Iterate over all the keys
	        for (var key in object) {
	            var value = object[key];
	            // Is there an override value
	            if (typeof (value === null || value === void 0 ? void 0 : value.toBSON) === 'function') {
	                value = value.toBSON();
	            }
	            // Check the type of the value
	            var type = typeof value;
	            // Check the key and throw error if it's illegal
	            if (typeof key === 'string' && !ignoreKeys.has(key)) {
	                if (key.match(regexp) != null) {
	                    // The BSON spec doesn't allow keys with null bytes because keys are
	                    // null-terminated.
	                    throw Error('key ' + key + ' must not contain null bytes');
	                }
	                if (checkKeys) {
	                    if ('$' === key[0]) {
	                        throw Error('key ' + key + " must not start with '$'");
	                    }
	                    else if (~key.indexOf('.')) {
	                        throw Error('key ' + key + " must not contain '.'");
	                    }
	                }
	            }
	            if (type === 'string') {
	                index = serializeString(buffer, key, value, index);
	            }
	            else if (type === 'number') {
	                index = serializeNumber(buffer, key, value, index);
	            }
	            else if (type === 'bigint') {
	                throw new BSONTypeError('Unsupported type BigInt, please use Decimal128');
	            }
	            else if (type === 'boolean') {
	                index = serializeBoolean(buffer, key, value, index);
	            }
	            else if (value instanceof Date || isDate(value)) {
	                index = serializeDate(buffer, key, value, index);
	            }
	            else if (value === undefined) {
	                if (ignoreUndefined === false)
	                    index = serializeNull(buffer, key, value, index);
	            }
	            else if (value === null) {
	                index = serializeNull(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	                index = serializeObjectId(buffer, key, value, index);
	            }
	            else if (isUint8Array(value)) {
	                index = serializeBuffer(buffer, key, value, index);
	            }
	            else if (value instanceof RegExp || isRegExp(value)) {
	                index = serializeRegExp(buffer, key, value, index);
	            }
	            else if (type === 'object' && value['_bsontype'] == null) {
	                index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
	            }
	            else if (type === 'object' && value['_bsontype'] === 'Decimal128') {
	                index = serializeDecimal128(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Timestamp') {
	                index = serializeLong(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Double') {
	                index = serializeDouble(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Code') {
	                index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
	            }
	            else if (typeof value === 'function' && serializeFunctions) {
	                index = serializeFunction(buffer, key, value, index, checkKeys, depth, serializeFunctions);
	            }
	            else if (value['_bsontype'] === 'Binary') {
	                index = serializeBinary(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Symbol') {
	                index = serializeSymbol(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'DBRef') {
	                index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions);
	            }
	            else if (value['_bsontype'] === 'BSONRegExp') {
	                index = serializeBSONRegExp(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'Int32') {
	                index = serializeInt32(buffer, key, value, index);
	            }
	            else if (value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	                index = serializeMinMax(buffer, key, value, index);
	            }
	            else if (typeof value['_bsontype'] !== 'undefined') {
	                throw new BSONTypeError("Unrecognized or invalid _bsontype: ".concat(String(value['_bsontype'])));
	            }
	        }
	    }
	    // Remove the path
	    path.pop();
	    // Final padding byte for object
	    buffer[index++] = 0x00;
	    // Final size
	    var size = index - startingIndex;
	    // Write the size of the object
	    buffer[startingIndex++] = size & 0xff;
	    buffer[startingIndex++] = (size >> 8) & 0xff;
	    buffer[startingIndex++] = (size >> 16) & 0xff;
	    buffer[startingIndex++] = (size >> 24) & 0xff;
	    return index;
	}

	/** @internal */
	// Default Max Size
	var MAXSIZE = 1024 * 1024 * 17;
	// Current Internal Temporary Serialization Buffer
	var buffer = buffer_1.alloc(MAXSIZE);
	/**
	 * Sets the size of the internal serialization buffer.
	 *
	 * @param size - The desired size for the internal serialization buffer
	 * @public
	 */
	function setInternalBufferSize(size) {
	    // Resize the internal serialization buffer if needed
	    if (buffer.length < size) {
	        buffer = buffer_1.alloc(size);
	    }
	}
	/**
	 * Serialize a Javascript object.
	 *
	 * @param object - the Javascript object to serialize.
	 * @returns Buffer object containing the serialized object.
	 * @public
	 */
	function serialize(object, options) {
	    if (options === void 0) { options = {}; }
	    // Unpack the options
	    var checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
	    var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	    var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	    var minInternalBufferSize = typeof options.minInternalBufferSize === 'number' ? options.minInternalBufferSize : MAXSIZE;
	    // Resize the internal serialization buffer if needed
	    if (buffer.length < minInternalBufferSize) {
	        buffer = buffer_1.alloc(minInternalBufferSize);
	    }
	    // Attempt to serialize
	    var serializationIndex = serializeInto(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, []);
	    // Create the final buffer
	    var finishedBuffer = buffer_1.alloc(serializationIndex);
	    // Copy into the finished buffer
	    buffer.copy(finishedBuffer, 0, 0, finishedBuffer.length);
	    // Return the buffer
	    return finishedBuffer;
	}
	/**
	 * Serialize a Javascript object using a predefined Buffer and index into the buffer,
	 * useful when pre-allocating the space for serialization.
	 *
	 * @param object - the Javascript object to serialize.
	 * @param finalBuffer - the Buffer you pre-allocated to store the serialized BSON object.
	 * @returns the index pointing to the last written byte in the buffer.
	 * @public
	 */
	function serializeWithBufferAndIndex(object, finalBuffer, options) {
	    if (options === void 0) { options = {}; }
	    // Unpack the options
	    var checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
	    var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	    var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	    var startIndex = typeof options.index === 'number' ? options.index : 0;
	    // Attempt to serialize
	    var serializationIndex = serializeInto(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined);
	    buffer.copy(finalBuffer, startIndex, 0, serializationIndex);
	    // Return the index
	    return startIndex + serializationIndex - 1;
	}
	/**
	 * Deserialize data as BSON.
	 *
	 * @param buffer - the buffer containing the serialized set of BSON documents.
	 * @returns returns the deserialized Javascript Object.
	 * @public
	 */
	function deserialize(buffer, options) {
	    if (options === void 0) { options = {}; }
	    return deserialize$1(buffer instanceof buffer_1 ? buffer : ensureBuffer(buffer), options);
	}
	/**
	 * Calculate the bson size for a passed in Javascript object.
	 *
	 * @param object - the Javascript object to calculate the BSON byte size for
	 * @returns size of BSON object in bytes
	 * @public
	 */
	function calculateObjectSize(object, options) {
	    if (options === void 0) { options = {}; }
	    options = options || {};
	    var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	    var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	    return calculateObjectSize$1(object, serializeFunctions, ignoreUndefined);
	}
	/**
	 * Deserialize stream data as BSON documents.
	 *
	 * @param data - the buffer containing the serialized set of BSON documents.
	 * @param startIndex - the start index in the data Buffer where the deserialization is to start.
	 * @param numberOfDocuments - number of documents to deserialize.
	 * @param documents - an array where to store the deserialized documents.
	 * @param docStartIndex - the index in the documents array from where to start inserting documents.
	 * @param options - additional options used for the deserialization.
	 * @returns next index in the buffer after deserialization **x** numbers of documents.
	 * @public
	 */
	function deserializeStream(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
	    var internalOptions = Object.assign({ allowObjectSmallerThanBufferSize: true, index: 0 }, options);
	    var bufferData = ensureBuffer(data);
	    var index = startIndex;
	    // Loop over all documents
	    for (var i = 0; i < numberOfDocuments; i++) {
	        // Find size of the document
	        var size = bufferData[index] |
	            (bufferData[index + 1] << 8) |
	            (bufferData[index + 2] << 16) |
	            (bufferData[index + 3] << 24);
	        // Update options with index
	        internalOptions.index = index;
	        // Parse the document at this point
	        documents[docStartIndex + i] = deserialize$1(bufferData, internalOptions);
	        // Adjust index by the document size
	        index = index + size;
	    }
	    // Return object containing end index of parsing and list of documents
	    return index;
	}
	/**
	 * BSON default export
	 * @deprecated Please use named exports
	 * @privateRemarks
	 * We want to someday deprecate the default export,
	 * so none of the new TS types are being exported on the default
	 * @public
	 */
	var BSON = {
	    Binary: Binary,
	    Code: Code,
	    DBRef: DBRef,
	    Decimal128: Decimal128,
	    Double: Double,
	    Int32: Int32,
	    Long: Long,
	    UUID: UUID,
	    Map: exports.Map,
	    MaxKey: MaxKey,
	    MinKey: MinKey,
	    ObjectId: ObjectId,
	    ObjectID: ObjectId,
	    BSONRegExp: BSONRegExp,
	    BSONSymbol: BSONSymbol,
	    Timestamp: Timestamp,
	    EJSON: exports.EJSON,
	    setInternalBufferSize: setInternalBufferSize,
	    serialize: serialize,
	    serializeWithBufferAndIndex: serializeWithBufferAndIndex,
	    deserialize: deserialize,
	    calculateObjectSize: calculateObjectSize,
	    deserializeStream: deserializeStream,
	    BSONError: BSONError,
	    BSONTypeError: BSONTypeError
	};

	exports.BSONError = BSONError;
	exports.BSONRegExp = BSONRegExp;
	exports.BSONSymbol = BSONSymbol;
	exports.BSONTypeError = BSONTypeError;
	exports.BSON_BINARY_SUBTYPE_BYTE_ARRAY = BSON_BINARY_SUBTYPE_BYTE_ARRAY;
	exports.BSON_BINARY_SUBTYPE_COLUMN = BSON_BINARY_SUBTYPE_COLUMN;
	exports.BSON_BINARY_SUBTYPE_DEFAULT = BSON_BINARY_SUBTYPE_DEFAULT;
	exports.BSON_BINARY_SUBTYPE_ENCRYPTED = BSON_BINARY_SUBTYPE_ENCRYPTED;
	exports.BSON_BINARY_SUBTYPE_FUNCTION = BSON_BINARY_SUBTYPE_FUNCTION;
	exports.BSON_BINARY_SUBTYPE_MD5 = BSON_BINARY_SUBTYPE_MD5;
	exports.BSON_BINARY_SUBTYPE_USER_DEFINED = BSON_BINARY_SUBTYPE_USER_DEFINED;
	exports.BSON_BINARY_SUBTYPE_UUID = BSON_BINARY_SUBTYPE_UUID;
	exports.BSON_BINARY_SUBTYPE_UUID_NEW = BSON_BINARY_SUBTYPE_UUID_NEW;
	exports.BSON_DATA_ARRAY = BSON_DATA_ARRAY;
	exports.BSON_DATA_BINARY = BSON_DATA_BINARY;
	exports.BSON_DATA_BOOLEAN = BSON_DATA_BOOLEAN;
	exports.BSON_DATA_CODE = BSON_DATA_CODE;
	exports.BSON_DATA_CODE_W_SCOPE = BSON_DATA_CODE_W_SCOPE;
	exports.BSON_DATA_DATE = BSON_DATA_DATE;
	exports.BSON_DATA_DBPOINTER = BSON_DATA_DBPOINTER;
	exports.BSON_DATA_DECIMAL128 = BSON_DATA_DECIMAL128;
	exports.BSON_DATA_INT = BSON_DATA_INT;
	exports.BSON_DATA_LONG = BSON_DATA_LONG;
	exports.BSON_DATA_MAX_KEY = BSON_DATA_MAX_KEY;
	exports.BSON_DATA_MIN_KEY = BSON_DATA_MIN_KEY;
	exports.BSON_DATA_NULL = BSON_DATA_NULL;
	exports.BSON_DATA_NUMBER = BSON_DATA_NUMBER;
	exports.BSON_DATA_OBJECT = BSON_DATA_OBJECT;
	exports.BSON_DATA_OID = BSON_DATA_OID;
	exports.BSON_DATA_REGEXP = BSON_DATA_REGEXP;
	exports.BSON_DATA_STRING = BSON_DATA_STRING;
	exports.BSON_DATA_SYMBOL = BSON_DATA_SYMBOL;
	exports.BSON_DATA_TIMESTAMP = BSON_DATA_TIMESTAMP;
	exports.BSON_DATA_UNDEFINED = BSON_DATA_UNDEFINED;
	exports.BSON_INT32_MAX = BSON_INT32_MAX$1;
	exports.BSON_INT32_MIN = BSON_INT32_MIN$1;
	exports.BSON_INT64_MAX = BSON_INT64_MAX$1;
	exports.BSON_INT64_MIN = BSON_INT64_MIN$1;
	exports.Binary = Binary;
	exports.Code = Code;
	exports.DBRef = DBRef;
	exports.Decimal128 = Decimal128;
	exports.Double = Double;
	exports.Int32 = Int32;
	exports.Long = Long;
	exports.LongWithoutOverridesClass = LongWithoutOverridesClass;
	exports.MaxKey = MaxKey;
	exports.MinKey = MinKey;
	exports.ObjectID = ObjectId;
	exports.ObjectId = ObjectId;
	exports.Timestamp = Timestamp;
	exports.UUID = UUID;
	exports.calculateObjectSize = calculateObjectSize;
	exports.default = BSON;
	exports.deserialize = deserialize;
	exports.deserializeStream = deserializeStream;
	exports.serialize = serialize;
	exports.serializeWithBufferAndIndex = serializeWithBufferAndIndex;
	exports.setInternalBufferSize = setInternalBufferSize;

	Object.defineProperty(exports, '__esModule', { value: true });

})));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"buffer":13}],13:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":11,"buffer":13,"ieee754":36}],14:[function(require,module,exports){
(function (Buffer){(function (){
const uuid = require("uuid");
const io = require("socket.io-client");

class ChatGPT {
	constructor(sessionToken, bypassNode = "https://gpt.pawan.krd") {
		this.ready = false;
		this.socket = io.connect(bypassNode, {
			pingInterval: 10000,
			pingTimeout: 5000,
			reconnection: true,
			reconnectionAttempts: 1000,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			timeout: 10000,
			transports: ["websocket", "polling"],
			upgrade: false,
			forceNew: true,
		});
		this.sessionToken = sessionToken;
		this.conversations = [];
		this.auth = null;
		this.expires = new Date();
		this.pauseTokenChecks = false;
		this.socket.on("connect", () => {
			console.log("Connected to server");
		});
		this.socket.on("disconnect", () => {
			console.log("Disconnected from server");
		});
		setInterval(async () => {
			if (this.pauseTokenChecks) return;
			this.pauseTokenChecks = true;
			const now = new Date();
			const offset = 2 * 60 * 1000;
			if (this.expires < now - offset || !this.auth) {
				await this.getTokens();
			}
			this.pauseTokenChecks = false;
		}, 500);
		setInterval(() => {
			const now = Date.now();
			this.conversations = this.conversations.filter((conversation) => {
				return now - conversation.lastActive < 1800000; // 2 minutes in milliseconds
			});
		}, 60000);
	}

	addConversation(id) {
		let conversation = {
			id: id,
			conversationId: null,
			parentId: uuid.v4(),
			lastActive: Date.now(),
		};
		this.conversations.push(conversation);
		return conversation;
	}

	getConversationById(id) {
		let conversation = this.conversations.find(
			(conversation) => conversation.id === id,
		);
		if (!conversation) {
			conversation = this.addConversation(id);
		} else {
			conversation.lastActive = Date.now();
		}
		return conversation;
	}

	resetConversation(id = "default") {
		let conversation = this.conversations.find(
			(conversation) => conversation.id === id,
		);
		if (!conversation) return;
		conversation.conversationId = null;
	}

	async Wait(time) {
		return new Promise((resolve) => {
			setTimeout(resolve, time);
		});
	}

	async waitForReady() {
		while (!this.ready) await this.Wait(25);
		console.log("Ready!!");
	}

	async ask(prompt, id = "default") {
		if (!this.auth || !this.validateToken(this.auth)) await this.getTokens();
		let conversation = this.getConversationById(id);
		let data = await new Promise((resolve) => {
			this.socket.emit(
				"askQuestion",
				{
					prompt: prompt,
					parentId: conversation.parentId,
					conversationId: conversation.conversationId,
					auth: this.auth,
				},
				(data) => {
					resolve(data);
				},
			);
		});

		if (data.error) console.log(`Error: ${data.error}`);

		conversation.parentId = data.messageId;
		conversation.conversationId = data.conversationId;

		return data.answer;
	}

	validateToken(token) {
		if (!token) return false;
		const parsed = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString(),
		);

		return Date.now() <= parsed.exp * 1000;
	}

	async getTokens() {
		await this.Wait(1000);
		let data = await new Promise((resolve) => {
			this.socket.emit("getSession", this.sessionToken, (data) => {
				resolve(data);
			});
		});
		if (data.error) console.log(`Error: ${data.error}`);
		this.sessionToken = data.sessionToken;
		this.auth = data.auth;
		this.expires = data.expires;
		this.ready = true;
	}
}

module.exports = ChatGPT;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":13,"socket.io-client":42,"uuid":50}],15:[function(require,module,exports){
(function (process){(function (){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this)}).call(this,require('_process'))
},{"./common":16,"_process":39}],16:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":38}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCORS = void 0;
// imported from https://github.com/component/has-cors
let value = false;
try {
    value = typeof XMLHttpRequest !== 'undefined' &&
        'withCredentials' in new XMLHttpRequest();
}
catch (err) {
    // if XMLHttp support is disabled in IE then it will throw
    // when trying to create
}
exports.hasCORS = value;

},{}],18:[function(require,module,exports){
"use strict";
// imported from https://github.com/galkn/querystring
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
function encode(obj) {
    let str = '';
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (str.length)
                str += '&';
            str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
        }
    }
    return str;
}
exports.encode = encode;
/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */
function decode(qs) {
    let qry = {};
    let pairs = qs.split('&');
    for (let i = 0, l = pairs.length; i < l; i++) {
        let pair = pairs[i].split('=');
        qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
}
exports.decode = decode;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
// imported from https://github.com/galkn/parseuri
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */
const re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
const parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];
function parse(str) {
    const src = str, b = str.indexOf('['), e = str.indexOf(']');
    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }
    let m = re.exec(str || ''), uri = {}, i = 14;
    while (i--) {
        uri[parts[i]] = m[i] || '';
    }
    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }
    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);
    return uri;
}
exports.parse = parse;
function pathNames(obj, path) {
    const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
    if (path.slice(0, 1) == '/' || path.length === 0) {
        names.splice(0, 1);
    }
    if (path.slice(-1) == '/') {
        names.splice(names.length - 1, 1);
    }
    return names;
}
function queryKey(uri, query) {
    const data = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
        if ($1) {
            data[$1] = $2;
        }
    });
    return data;
}

},{}],20:[function(require,module,exports){
// imported from https://github.com/unshiftio/yeast
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.yeast = exports.decode = exports.encode = void 0;
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
let seed = 0, i = 0, prev;
/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
    let encoded = '';
    do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
    } while (num > 0);
    return encoded;
}
exports.encode = encode;
/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
    let decoded = 0;
    for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
    }
    return decoded;
}
exports.decode = decode;
/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
    const now = encode(+new Date());
    if (now !== prev)
        return seed = 0, prev = now;
    return now + '.' + encode(seed++);
}
exports.yeast = yeast;
//
// Map each character to its index.
//
for (; i < length; i++)
    map[alphabet[i]] = i;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalThisShim = void 0;
exports.globalThisShim = (() => {
    if (typeof self !== "undefined") {
        return self;
    }
    else if (typeof window !== "undefined") {
        return window;
    }
    else {
        return Function("return this")();
    }
})();

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTick = exports.parse = exports.installTimerFunctions = exports.transports = exports.Transport = exports.protocol = exports.Socket = void 0;
const socket_js_1 = require("./socket.js");
Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_js_1.Socket; } });
exports.protocol = socket_js_1.Socket.protocol;
var transport_js_1 = require("./transport.js");
Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return transport_js_1.Transport; } });
var index_js_1 = require("./transports/index.js");
Object.defineProperty(exports, "transports", { enumerable: true, get: function () { return index_js_1.transports; } });
var util_js_1 = require("./util.js");
Object.defineProperty(exports, "installTimerFunctions", { enumerable: true, get: function () { return util_js_1.installTimerFunctions; } });
var parseuri_js_1 = require("./contrib/parseuri.js");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parseuri_js_1.parse; } });
var websocket_constructor_js_1 = require("./transports/websocket-constructor.js");
Object.defineProperty(exports, "nextTick", { enumerable: true, get: function () { return websocket_constructor_js_1.nextTick; } });

},{"./contrib/parseuri.js":19,"./socket.js":23,"./transport.js":24,"./transports/index.js":25,"./transports/websocket-constructor.js":27,"./util.js":30}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const index_js_1 = require("./transports/index.js");
const util_js_1 = require("./util.js");
const parseqs_js_1 = require("./contrib/parseqs.js");
const parseuri_js_1 = require("./contrib/parseuri.js");
const debug_1 = __importDefault(require("debug")); // debug()
const component_emitter_1 = require("@socket.io/component-emitter");
const engine_io_parser_1 = require("engine.io-parser");
const debug = (0, debug_1.default)("engine.io-client:socket"); // debug()
class Socket extends component_emitter_1.Emitter {
    /**
     * Socket constructor.
     *
     * @param {String|Object} uri or options
     * @param {Object} opts - options
     * @api public
     */
    constructor(uri, opts = {}) {
        super();
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = null;
        }
        if (uri) {
            uri = (0, parseuri_js_1.parse)(uri);
            opts.hostname = uri.host;
            opts.secure = uri.protocol === "https" || uri.protocol === "wss";
            opts.port = uri.port;
            if (uri.query)
                opts.query = uri.query;
        }
        else if (opts.host) {
            opts.hostname = (0, parseuri_js_1.parse)(opts.host).host;
        }
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.secure =
            null != opts.secure
                ? opts.secure
                : typeof location !== "undefined" && "https:" === location.protocol;
        if (opts.hostname && !opts.port) {
            // if no port is specified manually, use the protocol default
            opts.port = this.secure ? "443" : "80";
        }
        this.hostname =
            opts.hostname ||
                (typeof location !== "undefined" ? location.hostname : "localhost");
        this.port =
            opts.port ||
                (typeof location !== "undefined" && location.port
                    ? location.port
                    : this.secure
                        ? "443"
                        : "80");
        this.transports = opts.transports || ["polling", "websocket"];
        this.readyState = "";
        this.writeBuffer = [];
        this.prevBufferLen = 0;
        this.opts = Object.assign({
            path: "/engine.io",
            agent: false,
            withCredentials: false,
            upgrade: true,
            timestampParam: "t",
            rememberUpgrade: false,
            rejectUnauthorized: true,
            perMessageDeflate: {
                threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: true
        }, opts);
        this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
        if (typeof this.opts.query === "string") {
            this.opts.query = (0, parseqs_js_1.decode)(this.opts.query);
        }
        // set on handshake
        this.id = null;
        this.upgrades = null;
        this.pingInterval = null;
        this.pingTimeout = null;
        // set on heartbeat
        this.pingTimeoutTimer = null;
        if (typeof addEventListener === "function") {
            if (this.opts.closeOnBeforeunload) {
                // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                // closed/reloaded)
                this.beforeunloadEventListener = () => {
                    if (this.transport) {
                        // silently close the transport
                        this.transport.removeAllListeners();
                        this.transport.close();
                    }
                };
                addEventListener("beforeunload", this.beforeunloadEventListener, false);
            }
            if (this.hostname !== "localhost") {
                this.offlineEventListener = () => {
                    this.onClose("transport close", {
                        description: "network connection lost"
                    });
                };
                addEventListener("offline", this.offlineEventListener, false);
            }
        }
        this.open();
    }
    /**
     * Creates transport of the given type.
     *
     * @param {String} transport name
     * @return {Transport}
     * @api private
     */
    createTransport(name) {
        debug('creating transport "%s"', name);
        const query = Object.assign({}, this.opts.query);
        // append engine.io protocol identifier
        query.EIO = engine_io_parser_1.protocol;
        // transport name
        query.transport = name;
        // session id if we already have one
        if (this.id)
            query.sid = this.id;
        const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
            query,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
        });
        debug("options: %j", opts);
        return new index_js_1.transports[name](opts);
    }
    /**
     * Initializes transport to use and starts probe.
     *
     * @api private
     */
    open() {
        let transport;
        if (this.opts.rememberUpgrade &&
            Socket.priorWebsocketSuccess &&
            this.transports.indexOf("websocket") !== -1) {
            transport = "websocket";
        }
        else if (0 === this.transports.length) {
            // Emit error on next tick so it can be listened to
            this.setTimeoutFn(() => {
                this.emitReserved("error", "No transports available");
            }, 0);
            return;
        }
        else {
            transport = this.transports[0];
        }
        this.readyState = "opening";
        // Retry with the next transport if the transport is disabled (jsonp: false)
        try {
            transport = this.createTransport(transport);
        }
        catch (e) {
            debug("error while creating transport: %s", e);
            this.transports.shift();
            this.open();
            return;
        }
        transport.open();
        this.setTransport(transport);
    }
    /**
     * Sets the current transport. Disables the existing one (if any).
     *
     * @api private
     */
    setTransport(transport) {
        debug("setting transport %s", transport.name);
        if (this.transport) {
            debug("clearing existing transport %s", this.transport.name);
            this.transport.removeAllListeners();
        }
        // set up transport
        this.transport = transport;
        // set up transport listeners
        transport
            .on("drain", this.onDrain.bind(this))
            .on("packet", this.onPacket.bind(this))
            .on("error", this.onError.bind(this))
            .on("close", reason => this.onClose("transport close", reason));
    }
    /**
     * Probes a transport.
     *
     * @param {String} transport name
     * @api private
     */
    probe(name) {
        debug('probing transport "%s"', name);
        let transport = this.createTransport(name);
        let failed = false;
        Socket.priorWebsocketSuccess = false;
        const onTransportOpen = () => {
            if (failed)
                return;
            debug('probe transport "%s" opened', name);
            transport.send([{ type: "ping", data: "probe" }]);
            transport.once("packet", msg => {
                if (failed)
                    return;
                if ("pong" === msg.type && "probe" === msg.data) {
                    debug('probe transport "%s" pong', name);
                    this.upgrading = true;
                    this.emitReserved("upgrading", transport);
                    if (!transport)
                        return;
                    Socket.priorWebsocketSuccess = "websocket" === transport.name;
                    debug('pausing current transport "%s"', this.transport.name);
                    this.transport.pause(() => {
                        if (failed)
                            return;
                        if ("closed" === this.readyState)
                            return;
                        debug("changing transport and sending upgrade packet");
                        cleanup();
                        this.setTransport(transport);
                        transport.send([{ type: "upgrade" }]);
                        this.emitReserved("upgrade", transport);
                        transport = null;
                        this.upgrading = false;
                        this.flush();
                    });
                }
                else {
                    debug('probe transport "%s" failed', name);
                    const err = new Error("probe error");
                    // @ts-ignore
                    err.transport = transport.name;
                    this.emitReserved("upgradeError", err);
                }
            });
        };
        function freezeTransport() {
            if (failed)
                return;
            // Any callback called by transport should be ignored since now
            failed = true;
            cleanup();
            transport.close();
            transport = null;
        }
        // Handle any error that happens while probing
        const onerror = err => {
            const error = new Error("probe error: " + err);
            // @ts-ignore
            error.transport = transport.name;
            freezeTransport();
            debug('probe transport "%s" failed because of error: %s', name, err);
            this.emitReserved("upgradeError", error);
        };
        function onTransportClose() {
            onerror("transport closed");
        }
        // When the socket is closed while we're probing
        function onclose() {
            onerror("socket closed");
        }
        // When the socket is upgraded while we're probing
        function onupgrade(to) {
            if (transport && to.name !== transport.name) {
                debug('"%s" works - aborting "%s"', to.name, transport.name);
                freezeTransport();
            }
        }
        // Remove all listeners on the transport and on self
        const cleanup = () => {
            transport.removeListener("open", onTransportOpen);
            transport.removeListener("error", onerror);
            transport.removeListener("close", onTransportClose);
            this.off("close", onclose);
            this.off("upgrading", onupgrade);
        };
        transport.once("open", onTransportOpen);
        transport.once("error", onerror);
        transport.once("close", onTransportClose);
        this.once("close", onclose);
        this.once("upgrading", onupgrade);
        transport.open();
    }
    /**
     * Called when connection is deemed open.
     *
     * @api private
     */
    onOpen() {
        debug("socket open");
        this.readyState = "open";
        Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
        this.emitReserved("open");
        this.flush();
        // we check for `readyState` in case an `open`
        // listener already closed the socket
        if ("open" === this.readyState &&
            this.opts.upgrade &&
            this.transport.pause) {
            debug("starting upgrade probes");
            let i = 0;
            const l = this.upgrades.length;
            for (; i < l; i++) {
                this.probe(this.upgrades[i]);
            }
        }
    }
    /**
     * Handles a packet.
     *
     * @api private
     */
    onPacket(packet) {
        if ("opening" === this.readyState ||
            "open" === this.readyState ||
            "closing" === this.readyState) {
            debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
            this.emitReserved("packet", packet);
            // Socket is live - any packet counts
            this.emitReserved("heartbeat");
            switch (packet.type) {
                case "open":
                    this.onHandshake(JSON.parse(packet.data));
                    break;
                case "ping":
                    this.resetPingTimeout();
                    this.sendPacket("pong");
                    this.emitReserved("ping");
                    this.emitReserved("pong");
                    break;
                case "error":
                    const err = new Error("server error");
                    // @ts-ignore
                    err.code = packet.data;
                    this.onError(err);
                    break;
                case "message":
                    this.emitReserved("data", packet.data);
                    this.emitReserved("message", packet.data);
                    break;
            }
        }
        else {
            debug('packet received with socket readyState "%s"', this.readyState);
        }
    }
    /**
     * Called upon handshake completion.
     *
     * @param {Object} data - handshake obj
     * @api private
     */
    onHandshake(data) {
        this.emitReserved("handshake", data);
        this.id = data.sid;
        this.transport.query.sid = data.sid;
        this.upgrades = this.filterUpgrades(data.upgrades);
        this.pingInterval = data.pingInterval;
        this.pingTimeout = data.pingTimeout;
        this.maxPayload = data.maxPayload;
        this.onOpen();
        // In case open handler closes socket
        if ("closed" === this.readyState)
            return;
        this.resetPingTimeout();
    }
    /**
     * Sets and resets ping timeout timer based on server pings.
     *
     * @api private
     */
    resetPingTimeout() {
        this.clearTimeoutFn(this.pingTimeoutTimer);
        this.pingTimeoutTimer = this.setTimeoutFn(() => {
            this.onClose("ping timeout");
        }, this.pingInterval + this.pingTimeout);
        if (this.opts.autoUnref) {
            this.pingTimeoutTimer.unref();
        }
    }
    /**
     * Called on `drain` event
     *
     * @api private
     */
    onDrain() {
        this.writeBuffer.splice(0, this.prevBufferLen);
        // setting prevBufferLen = 0 is very important
        // for example, when upgrading, upgrade packet is sent over,
        // and a nonzero prevBufferLen could cause problems on `drain`
        this.prevBufferLen = 0;
        if (0 === this.writeBuffer.length) {
            this.emitReserved("drain");
        }
        else {
            this.flush();
        }
    }
    /**
     * Flush write buffers.
     *
     * @api private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            !this.upgrading &&
            this.writeBuffer.length) {
            const packets = this.getWritablePackets();
            debug("flushing %d packets in socket", packets.length);
            this.transport.send(packets);
            // keep track of current length of writeBuffer
            // splice writeBuffer and callbackBuffer on `drain`
            this.prevBufferLen = packets.length;
            this.emitReserved("flush");
        }
    }
    /**
     * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
     * long-polling)
     *
     * @private
     */
    getWritablePackets() {
        const shouldCheckPayloadSize = this.maxPayload &&
            this.transport.name === "polling" &&
            this.writeBuffer.length > 1;
        if (!shouldCheckPayloadSize) {
            return this.writeBuffer;
        }
        let payloadSize = 1; // first packet type
        for (let i = 0; i < this.writeBuffer.length; i++) {
            const data = this.writeBuffer[i].data;
            if (data) {
                payloadSize += (0, util_js_1.byteLength)(data);
            }
            if (i > 0 && payloadSize > this.maxPayload) {
                debug("only send %d out of %d packets", i, this.writeBuffer.length);
                return this.writeBuffer.slice(0, i);
            }
            payloadSize += 2; // separator + packet type
        }
        debug("payload size is %d (max: %d)", payloadSize, this.maxPayload);
        return this.writeBuffer;
    }
    /**
     * Sends a message.
     *
     * @param {String} message.
     * @param {Function} callback function.
     * @param {Object} options.
     * @return {Socket} for chaining.
     * @api public
     */
    write(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
    }
    send(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} packet type.
     * @param {String} data.
     * @param {Object} options.
     * @param {Function} callback function.
     * @api private
     */
    sendPacket(type, data, options, fn) {
        if ("function" === typeof data) {
            fn = data;
            data = undefined;
        }
        if ("function" === typeof options) {
            fn = options;
            options = null;
        }
        if ("closing" === this.readyState || "closed" === this.readyState) {
            return;
        }
        options = options || {};
        options.compress = false !== options.compress;
        const packet = {
            type: type,
            data: data,
            options: options
        };
        this.emitReserved("packetCreate", packet);
        this.writeBuffer.push(packet);
        if (fn)
            this.once("flush", fn);
        this.flush();
    }
    /**
     * Closes the connection.
     *
     * @api public
     */
    close() {
        const close = () => {
            this.onClose("forced close");
            debug("socket closing - telling transport to close");
            this.transport.close();
        };
        const cleanupAndClose = () => {
            this.off("upgrade", cleanupAndClose);
            this.off("upgradeError", cleanupAndClose);
            close();
        };
        const waitForUpgrade = () => {
            // wait for upgrade to finish since we can't send packets while pausing a transport
            this.once("upgrade", cleanupAndClose);
            this.once("upgradeError", cleanupAndClose);
        };
        if ("opening" === this.readyState || "open" === this.readyState) {
            this.readyState = "closing";
            if (this.writeBuffer.length) {
                this.once("drain", () => {
                    if (this.upgrading) {
                        waitForUpgrade();
                    }
                    else {
                        close();
                    }
                });
            }
            else if (this.upgrading) {
                waitForUpgrade();
            }
            else {
                close();
            }
        }
        return this;
    }
    /**
     * Called upon transport error
     *
     * @api private
     */
    onError(err) {
        debug("socket error %j", err);
        Socket.priorWebsocketSuccess = false;
        this.emitReserved("error", err);
        this.onClose("transport error", err);
    }
    /**
     * Called upon transport close.
     *
     * @api private
     */
    onClose(reason, description) {
        if ("opening" === this.readyState ||
            "open" === this.readyState ||
            "closing" === this.readyState) {
            debug('socket close with reason: "%s"', reason);
            // clear timers
            this.clearTimeoutFn(this.pingTimeoutTimer);
            // stop event from firing again for transport
            this.transport.removeAllListeners("close");
            // ensure transport won't stay open
            this.transport.close();
            // ignore further transport communication
            this.transport.removeAllListeners();
            if (typeof removeEventListener === "function") {
                removeEventListener("beforeunload", this.beforeunloadEventListener, false);
                removeEventListener("offline", this.offlineEventListener, false);
            }
            // set ready state
            this.readyState = "closed";
            // clear session id
            this.id = null;
            // emit close event
            this.emitReserved("close", reason, description);
            // clean buffers after, so users can still
            // grab the buffers on `close` event
            this.writeBuffer = [];
            this.prevBufferLen = 0;
        }
    }
    /**
     * Filters upgrades, returning only those matching client transports.
     *
     * @param {Array} server upgrades
     * @api private
     *
     */
    filterUpgrades(upgrades) {
        const filteredUpgrades = [];
        let i = 0;
        const j = upgrades.length;
        for (; i < j; i++) {
            if (~this.transports.indexOf(upgrades[i]))
                filteredUpgrades.push(upgrades[i]);
        }
        return filteredUpgrades;
    }
}
exports.Socket = Socket;
Socket.protocol = engine_io_parser_1.protocol;

},{"./contrib/parseqs.js":18,"./contrib/parseuri.js":19,"./transports/index.js":25,"./util.js":30,"@socket.io/component-emitter":10,"debug":15,"engine.io-parser":35}],24:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transport = void 0;
const engine_io_parser_1 = require("engine.io-parser");
const component_emitter_1 = require("@socket.io/component-emitter");
const util_js_1 = require("./util.js");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = (0, debug_1.default)("engine.io-client:transport"); // debug()
class TransportError extends Error {
    constructor(reason, description, context) {
        super(reason);
        this.description = description;
        this.context = context;
        this.type = "TransportError";
    }
}
class Transport extends component_emitter_1.Emitter {
    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */
    constructor(opts) {
        super();
        this.writable = false;
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.opts = opts;
        this.query = opts.query;
        this.readyState = "";
        this.socket = opts.socket;
    }
    /**
     * Emits an error.
     *
     * @param {String} reason
     * @param description
     * @param context - the error context
     * @return {Transport} for chaining
     * @api protected
     */
    onError(reason, description, context) {
        super.emitReserved("error", new TransportError(reason, description, context));
        return this;
    }
    /**
     * Opens the transport.
     *
     * @api public
     */
    open() {
        if ("closed" === this.readyState || "" === this.readyState) {
            this.readyState = "opening";
            this.doOpen();
        }
        return this;
    }
    /**
     * Closes the transport.
     *
     * @api public
     */
    close() {
        if ("opening" === this.readyState || "open" === this.readyState) {
            this.doClose();
            this.onClose();
        }
        return this;
    }
    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     * @api public
     */
    send(packets) {
        if ("open" === this.readyState) {
            this.write(packets);
        }
        else {
            // this might happen if the transport was silently closed in the beforeunload event handler
            debug("transport is not open, discarding packets");
        }
    }
    /**
     * Called upon open
     *
     * @api protected
     */
    onOpen() {
        this.readyState = "open";
        this.writable = true;
        super.emitReserved("open");
    }
    /**
     * Called with data.
     *
     * @param {String} data
     * @api protected
     */
    onData(data) {
        const packet = (0, engine_io_parser_1.decodePacket)(data, this.socket.binaryType);
        this.onPacket(packet);
    }
    /**
     * Called with a decoded packet.
     *
     * @api protected
     */
    onPacket(packet) {
        super.emitReserved("packet", packet);
    }
    /**
     * Called upon close.
     *
     * @api protected
     */
    onClose(details) {
        this.readyState = "closed";
        super.emitReserved("close", details);
    }
}
exports.Transport = Transport;

},{"./util.js":30,"@socket.io/component-emitter":10,"debug":15,"engine.io-parser":35}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transports = void 0;
const polling_js_1 = require("./polling.js");
const websocket_js_1 = require("./websocket.js");
exports.transports = {
    websocket: websocket_js_1.WS,
    polling: polling_js_1.Polling
};

},{"./polling.js":26,"./websocket.js":28}],26:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.Polling = void 0;
const transport_js_1 = require("../transport.js");
const debug_1 = __importDefault(require("debug")); // debug()
const yeast_js_1 = require("../contrib/yeast.js");
const parseqs_js_1 = require("../contrib/parseqs.js");
const engine_io_parser_1 = require("engine.io-parser");
const xmlhttprequest_js_1 = require("./xmlhttprequest.js");
const component_emitter_1 = require("@socket.io/component-emitter");
const util_js_1 = require("../util.js");
const globalThis_js_1 = require("../globalThis.js");
const debug = (0, debug_1.default)("engine.io-client:polling"); // debug()
function empty() { }
const hasXHR2 = (function () {
    const xhr = new xmlhttprequest_js_1.XHR({
        xdomain: false
    });
    return null != xhr.responseType;
})();
class Polling extends transport_js_1.Transport {
    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @api public
     */
    constructor(opts) {
        super(opts);
        this.polling = false;
        if (typeof location !== "undefined") {
            const isSSL = "https:" === location.protocol;
            let port = location.port;
            // some user agents have empty `location.port`
            if (!port) {
                port = isSSL ? "443" : "80";
            }
            this.xd =
                (typeof location !== "undefined" &&
                    opts.hostname !== location.hostname) ||
                    port !== opts.port;
            this.xs = opts.secure !== isSSL;
        }
        /**
         * XHR supports binary
         */
        const forceBase64 = opts && opts.forceBase64;
        this.supportsBinary = hasXHR2 && !forceBase64;
    }
    /**
     * Transport name.
     */
    get name() {
        return "polling";
    }
    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @api private
     */
    doOpen() {
        this.poll();
    }
    /**
     * Pauses polling.
     *
     * @param {Function} callback upon buffers are flushed and transport is paused
     * @api private
     */
    pause(onPause) {
        this.readyState = "pausing";
        const pause = () => {
            debug("paused");
            this.readyState = "paused";
            onPause();
        };
        if (this.polling || !this.writable) {
            let total = 0;
            if (this.polling) {
                debug("we are currently polling - waiting to pause");
                total++;
                this.once("pollComplete", function () {
                    debug("pre-pause polling complete");
                    --total || pause();
                });
            }
            if (!this.writable) {
                debug("we are currently writing - waiting to pause");
                total++;
                this.once("drain", function () {
                    debug("pre-pause writing complete");
                    --total || pause();
                });
            }
        }
        else {
            pause();
        }
    }
    /**
     * Starts polling cycle.
     *
     * @api public
     */
    poll() {
        debug("polling");
        this.polling = true;
        this.doPoll();
        this.emitReserved("poll");
    }
    /**
     * Overloads onData to detect payloads.
     *
     * @api private
     */
    onData(data) {
        debug("polling got data %s", data);
        const callback = packet => {
            // if its the first message we consider the transport open
            if ("opening" === this.readyState && packet.type === "open") {
                this.onOpen();
            }
            // if its a close packet, we close the ongoing requests
            if ("close" === packet.type) {
                this.onClose({ description: "transport closed by the server" });
                return false;
            }
            // otherwise bypass onData and handle the message
            this.onPacket(packet);
        };
        // decode payload
        (0, engine_io_parser_1.decodePayload)(data, this.socket.binaryType).forEach(callback);
        // if an event did not trigger closing
        if ("closed" !== this.readyState) {
            // if we got data we're not polling
            this.polling = false;
            this.emitReserved("pollComplete");
            if ("open" === this.readyState) {
                this.poll();
            }
            else {
                debug('ignoring poll - transport state "%s"', this.readyState);
            }
        }
    }
    /**
     * For polling, send a close packet.
     *
     * @api private
     */
    doClose() {
        const close = () => {
            debug("writing close packet");
            this.write([{ type: "close" }]);
        };
        if ("open" === this.readyState) {
            debug("transport open - closing");
            close();
        }
        else {
            // in case we're trying to close while
            // handshaking is in progress (GH-164)
            debug("transport not open - deferring close");
            this.once("open", close);
        }
    }
    /**
     * Writes a packets payload.
     *
     * @param {Array} data packets
     * @param {Function} drain callback
     * @api private
     */
    write(packets) {
        this.writable = false;
        (0, engine_io_parser_1.encodePayload)(packets, data => {
            this.doWrite(data, () => {
                this.writable = true;
                this.emitReserved("drain");
            });
        });
    }
    /**
     * Generates uri for connection.
     *
     * @api private
     */
    uri() {
        let query = this.query || {};
        const schema = this.opts.secure ? "https" : "http";
        let port = "";
        // cache busting is forced
        if (false !== this.opts.timestampRequests) {
            query[this.opts.timestampParam] = (0, yeast_js_1.yeast)();
        }
        if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
        }
        // avoid port if default for schema
        if (this.opts.port &&
            (("https" === schema && Number(this.opts.port) !== 443) ||
                ("http" === schema && Number(this.opts.port) !== 80))) {
            port = ":" + this.opts.port;
        }
        const encodedQuery = (0, parseqs_js_1.encode)(query);
        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return (schema +
            "://" +
            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
            port +
            this.opts.path +
            (encodedQuery.length ? "?" + encodedQuery : ""));
    }
    /**
     * Creates a request.
     *
     * @param {String} method
     * @api private
     */
    request(opts = {}) {
        Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
        return new Request(this.uri(), opts);
    }
    /**
     * Sends data.
     *
     * @param {String} data to send.
     * @param {Function} called upon flush.
     * @api private
     */
    doWrite(data, fn) {
        const req = this.request({
            method: "POST",
            data: data
        });
        req.on("success", fn);
        req.on("error", (xhrStatus, context) => {
            this.onError("xhr post error", xhrStatus, context);
        });
    }
    /**
     * Starts a poll cycle.
     *
     * @api private
     */
    doPoll() {
        debug("xhr poll");
        const req = this.request();
        req.on("data", this.onData.bind(this));
        req.on("error", (xhrStatus, context) => {
            this.onError("xhr poll error", xhrStatus, context);
        });
        this.pollXhr = req;
    }
}
exports.Polling = Polling;
class Request extends component_emitter_1.Emitter {
    /**
     * Request constructor
     *
     * @param {Object} options
     * @api public
     */
    constructor(uri, opts) {
        super();
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.opts = opts;
        this.method = opts.method || "GET";
        this.uri = uri;
        this.async = false !== opts.async;
        this.data = undefined !== opts.data ? opts.data : null;
        this.create();
    }
    /**
     * Creates the XHR object and sends the request.
     *
     * @api private
     */
    create() {
        const opts = (0, util_js_1.pick)(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
        opts.xdomain = !!this.opts.xd;
        opts.xscheme = !!this.opts.xs;
        const xhr = (this.xhr = new xmlhttprequest_js_1.XHR(opts));
        try {
            debug("xhr open %s: %s", this.method, this.uri);
            xhr.open(this.method, this.uri, this.async);
            try {
                if (this.opts.extraHeaders) {
                    xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                    for (let i in this.opts.extraHeaders) {
                        if (this.opts.extraHeaders.hasOwnProperty(i)) {
                            xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                        }
                    }
                }
            }
            catch (e) { }
            if ("POST" === this.method) {
                try {
                    xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                }
                catch (e) { }
            }
            try {
                xhr.setRequestHeader("Accept", "*/*");
            }
            catch (e) { }
            // ie6 check
            if ("withCredentials" in xhr) {
                xhr.withCredentials = this.opts.withCredentials;
            }
            if (this.opts.requestTimeout) {
                xhr.timeout = this.opts.requestTimeout;
            }
            xhr.onreadystatechange = () => {
                if (4 !== xhr.readyState)
                    return;
                if (200 === xhr.status || 1223 === xhr.status) {
                    this.onLoad();
                }
                else {
                    // make sure the `error` event handler that's user-set
                    // does not throw in the same tick and gets caught here
                    this.setTimeoutFn(() => {
                        this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                    }, 0);
                }
            };
            debug("xhr data %s", this.data);
            xhr.send(this.data);
        }
        catch (e) {
            // Need to defer since .create() is called directly from the constructor
            // and thus the 'error' event can only be only bound *after* this exception
            // occurs.  Therefore, also, we cannot throw here at all.
            this.setTimeoutFn(() => {
                this.onError(e);
            }, 0);
            return;
        }
        if (typeof document !== "undefined") {
            this.index = Request.requestsCount++;
            Request.requests[this.index] = this;
        }
    }
    /**
     * Called upon error.
     *
     * @api private
     */
    onError(err) {
        this.emitReserved("error", err, this.xhr);
        this.cleanup(true);
    }
    /**
     * Cleans up house.
     *
     * @api private
     */
    cleanup(fromError) {
        if ("undefined" === typeof this.xhr || null === this.xhr) {
            return;
        }
        this.xhr.onreadystatechange = empty;
        if (fromError) {
            try {
                this.xhr.abort();
            }
            catch (e) { }
        }
        if (typeof document !== "undefined") {
            delete Request.requests[this.index];
        }
        this.xhr = null;
    }
    /**
     * Called upon load.
     *
     * @api private
     */
    onLoad() {
        const data = this.xhr.responseText;
        if (data !== null) {
            this.emitReserved("data", data);
            this.emitReserved("success");
            this.cleanup();
        }
    }
    /**
     * Aborts the request.
     *
     * @api public
     */
    abort() {
        this.cleanup();
    }
}
exports.Request = Request;
Request.requestsCount = 0;
Request.requests = {};
/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */
if (typeof document !== "undefined") {
    // @ts-ignore
    if (typeof attachEvent === "function") {
        // @ts-ignore
        attachEvent("onunload", unloadHandler);
    }
    else if (typeof addEventListener === "function") {
        const terminationEvent = "onpagehide" in globalThis_js_1.globalThisShim ? "pagehide" : "unload";
        addEventListener(terminationEvent, unloadHandler, false);
    }
}
function unloadHandler() {
    for (let i in Request.requests) {
        if (Request.requests.hasOwnProperty(i)) {
            Request.requests[i].abort();
        }
    }
}

},{"../contrib/parseqs.js":18,"../contrib/yeast.js":20,"../globalThis.js":21,"../transport.js":24,"../util.js":30,"./xmlhttprequest.js":29,"@socket.io/component-emitter":10,"debug":15,"engine.io-parser":35}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBinaryType = exports.usingBrowserWebSocket = exports.WebSocket = exports.nextTick = void 0;
const globalThis_js_1 = require("../globalThis.js");
exports.nextTick = (() => {
    const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
    if (isPromiseAvailable) {
        return cb => Promise.resolve().then(cb);
    }
    else {
        return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
    }
})();
exports.WebSocket = globalThis_js_1.globalThisShim.WebSocket || globalThis_js_1.globalThisShim.MozWebSocket;
exports.usingBrowserWebSocket = true;
exports.defaultBinaryType = "arraybuffer";

},{"../globalThis.js":21}],28:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS = void 0;
const transport_js_1 = require("../transport.js");
const parseqs_js_1 = require("../contrib/parseqs.js");
const yeast_js_1 = require("../contrib/yeast.js");
const util_js_1 = require("../util.js");
const websocket_constructor_js_1 = require("./websocket-constructor.js");
const debug_1 = __importDefault(require("debug")); // debug()
const engine_io_parser_1 = require("engine.io-parser");
const debug = (0, debug_1.default)("engine.io-client:websocket"); // debug()
// detect ReactNative environment
const isReactNative = typeof navigator !== "undefined" &&
    typeof navigator.product === "string" &&
    navigator.product.toLowerCase() === "reactnative";
class WS extends transport_js_1.Transport {
    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */
    constructor(opts) {
        super(opts);
        this.supportsBinary = !opts.forceBase64;
    }
    /**
     * Transport name.
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Opens socket.
     *
     * @api private
     */
    doOpen() {
        if (!this.check()) {
            // let probe timeout
            return;
        }
        const uri = this.uri();
        const protocols = this.opts.protocols;
        // React Native only supports the 'headers' option, and will print a warning if anything else is passed
        const opts = isReactNative
            ? {}
            : (0, util_js_1.pick)(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        if (this.opts.extraHeaders) {
            opts.headers = this.opts.extraHeaders;
        }
        try {
            this.ws =
                websocket_constructor_js_1.usingBrowserWebSocket && !isReactNative
                    ? protocols
                        ? new websocket_constructor_js_1.WebSocket(uri, protocols)
                        : new websocket_constructor_js_1.WebSocket(uri)
                    : new websocket_constructor_js_1.WebSocket(uri, protocols, opts);
        }
        catch (err) {
            return this.emitReserved("error", err);
        }
        this.ws.binaryType = this.socket.binaryType || websocket_constructor_js_1.defaultBinaryType;
        this.addEventListeners();
    }
    /**
     * Adds event listeners to the socket
     *
     * @api private
     */
    addEventListeners() {
        this.ws.onopen = () => {
            if (this.opts.autoUnref) {
                this.ws._socket.unref();
            }
            this.onOpen();
        };
        this.ws.onclose = closeEvent => this.onClose({
            description: "websocket connection closed",
            context: closeEvent
        });
        this.ws.onmessage = ev => this.onData(ev.data);
        this.ws.onerror = e => this.onError("websocket error", e);
    }
    /**
     * Writes data to socket.
     *
     * @param {Array} array of packets.
     * @api private
     */
    write(packets) {
        this.writable = false;
        // encodePacket efficient as it uses WS framing
        // no need for encodePayload
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            (0, engine_io_parser_1.encodePacket)(packet, this.supportsBinary, data => {
                // always create a new object (GH-437)
                const opts = {};
                if (!websocket_constructor_js_1.usingBrowserWebSocket) {
                    if (packet.options) {
                        opts.compress = packet.options.compress;
                    }
                    if (this.opts.perMessageDeflate) {
                        const len = 
                        // @ts-ignore
                        "string" === typeof data ? Buffer.byteLength(data) : data.length;
                        if (len < this.opts.perMessageDeflate.threshold) {
                            opts.compress = false;
                        }
                    }
                }
                // Sometimes the websocket has already been closed but the browser didn't
                // have a chance of informing us about it yet, in that case send will
                // throw an error
                try {
                    if (websocket_constructor_js_1.usingBrowserWebSocket) {
                        // TypeError is thrown when passing the second argument on Safari
                        this.ws.send(data);
                    }
                    else {
                        this.ws.send(data, opts);
                    }
                }
                catch (e) {
                    debug("websocket closed before onclose event");
                }
                if (lastPacket) {
                    // fake drain
                    // defer to next tick to allow Socket to clear writeBuffer
                    (0, websocket_constructor_js_1.nextTick)(() => {
                        this.writable = true;
                        this.emitReserved("drain");
                    }, this.setTimeoutFn);
                }
            });
        }
    }
    /**
     * Closes socket.
     *
     * @api private
     */
    doClose() {
        if (typeof this.ws !== "undefined") {
            this.ws.close();
            this.ws = null;
        }
    }
    /**
     * Generates uri for connection.
     *
     * @api private
     */
    uri() {
        let query = this.query || {};
        const schema = this.opts.secure ? "wss" : "ws";
        let port = "";
        // avoid port if default for schema
        if (this.opts.port &&
            (("wss" === schema && Number(this.opts.port) !== 443) ||
                ("ws" === schema && Number(this.opts.port) !== 80))) {
            port = ":" + this.opts.port;
        }
        // append timestamp to URI
        if (this.opts.timestampRequests) {
            query[this.opts.timestampParam] = (0, yeast_js_1.yeast)();
        }
        // communicate binary support capabilities
        if (!this.supportsBinary) {
            query.b64 = 1;
        }
        const encodedQuery = (0, parseqs_js_1.encode)(query);
        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return (schema +
            "://" +
            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
            port +
            this.opts.path +
            (encodedQuery.length ? "?" + encodedQuery : ""));
    }
    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @api public
     */
    check() {
        return !!websocket_constructor_js_1.WebSocket;
    }
}
exports.WS = WS;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../contrib/parseqs.js":18,"../contrib/yeast.js":20,"../transport.js":24,"../util.js":30,"./websocket-constructor.js":27,"buffer":13,"debug":15,"engine.io-parser":35}],29:[function(require,module,exports){
"use strict";
// browser shim for xmlhttprequest module
Object.defineProperty(exports, "__esModule", { value: true });
exports.XHR = void 0;
const has_cors_js_1 = require("../contrib/has-cors.js");
const globalThis_js_1 = require("../globalThis.js");
function XHR(opts) {
    const xdomain = opts.xdomain;
    // XMLHttpRequest can be disabled on IE
    try {
        if ("undefined" !== typeof XMLHttpRequest && (!xdomain || has_cors_js_1.hasCORS)) {
            return new XMLHttpRequest();
        }
    }
    catch (e) { }
    if (!xdomain) {
        try {
            return new globalThis_js_1.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
        }
        catch (e) { }
    }
}
exports.XHR = XHR;

},{"../contrib/has-cors.js":17,"../globalThis.js":21}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byteLength = exports.installTimerFunctions = exports.pick = void 0;
const globalThis_js_1 = require("./globalThis.js");
function pick(obj, ...attr) {
    return attr.reduce((acc, k) => {
        if (obj.hasOwnProperty(k)) {
            acc[k] = obj[k];
        }
        return acc;
    }, {});
}
exports.pick = pick;
// Keep a reference to the real timeout functions so they can be used when overridden
const NATIVE_SET_TIMEOUT = setTimeout;
const NATIVE_CLEAR_TIMEOUT = clearTimeout;
function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
        obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis_js_1.globalThisShim);
        obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis_js_1.globalThisShim);
    }
    else {
        obj.setTimeoutFn = setTimeout.bind(globalThis_js_1.globalThisShim);
        obj.clearTimeoutFn = clearTimeout.bind(globalThis_js_1.globalThisShim);
    }
}
exports.installTimerFunctions = installTimerFunctions;
// base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
const BASE64_OVERHEAD = 1.33;
// we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
function byteLength(obj) {
    if (typeof obj === "string") {
        return utf8Length(obj);
    }
    // arraybuffer or blob
    return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
exports.byteLength = byteLength;
function utf8Length(str) {
    let c = 0, length = 0;
    for (let i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) {
            length += 1;
        }
        else if (c < 0x800) {
            length += 2;
        }
        else if (c < 0xd800 || c >= 0xe000) {
            length += 3;
        }
        else {
            i++;
            length += 4;
        }
    }
    return length;
}

},{"./globalThis.js":21}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_PACKET = exports.PACKET_TYPES_REVERSE = exports.PACKET_TYPES = void 0;
const PACKET_TYPES = Object.create(null); // no Map = no polyfill
exports.PACKET_TYPES = PACKET_TYPES;
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
exports.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
Object.keys(PACKET_TYPES).forEach(key => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };
exports.ERROR_PACKET = ERROR_PACKET;

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
// imported from https://github.com/socketio/base64-arraybuffer
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
const encode = (arraybuffer) => {
    let bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = '';
    for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    }
    else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
};
exports.encode = encode;
const decode = (base64) => {
    let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
};
exports.decode = decode;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commons_js_1 = require("./commons.js");
const base64_arraybuffer_js_1 = require("./contrib/base64-arraybuffer.js");
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        return {
            type: "message",
            data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
        };
    }
    const packetType = commons_js_1.PACKET_TYPES_REVERSE[type];
    if (!packetType) {
        return commons_js_1.ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: commons_js_1.PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
        }
        : {
            type: commons_js_1.PACKET_TYPES_REVERSE[type]
        };
};
const decodeBase64Packet = (data, binaryType) => {
    if (withNativeArrayBuffer) {
        const decoded = (0, base64_arraybuffer_js_1.decode)(data);
        return mapBinary(decoded, binaryType);
    }
    else {
        return { base64: true, data }; // fallback for old browsers
    }
};
const mapBinary = (data, binaryType) => {
    switch (binaryType) {
        case "blob":
            return data instanceof ArrayBuffer ? new Blob([data]) : data;
        case "arraybuffer":
        default:
            return data; // assuming the data is already an ArrayBuffer
    }
};
exports.default = decodePacket;

},{"./commons.js":31,"./contrib/base64-arraybuffer.js":32}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commons_js_1 = require("./commons.js");
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
// ArrayBuffer.isView method is not defined in IE10
const isView = obj => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj && obj.buffer instanceof ArrayBuffer;
};
const encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (withNativeBlob && data instanceof Blob) {
        if (supportsBinary) {
            return callback(data);
        }
        else {
            return encodeBlobAsBase64(data, callback);
        }
    }
    else if (withNativeArrayBuffer &&
        (data instanceof ArrayBuffer || isView(data))) {
        if (supportsBinary) {
            return callback(data);
        }
        else {
            return encodeBlobAsBase64(new Blob([data]), callback);
        }
    }
    // plain string
    return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
};
const encodeBlobAsBase64 = (data, callback) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const content = fileReader.result.split(",")[1];
        callback("b" + (content || ""));
    };
    return fileReader.readAsDataURL(data);
};
exports.default = encodePacket;

},{"./commons.js":31}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacket = exports.protocol = void 0;
const encodePacket_js_1 = require("./encodePacket.js");
exports.encodePacket = encodePacket_js_1.default;
const decodePacket_js_1 = require("./decodePacket.js");
exports.decodePacket = decodePacket_js_1.default;
const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const encodePayload = (packets, callback) => {
    // some packets may be added to the array while encoding, so the initial length must be saved
    const length = packets.length;
    const encodedPackets = new Array(length);
    let count = 0;
    packets.forEach((packet, i) => {
        // force base64 encoding for binary packets
        (0, encodePacket_js_1.default)(packet, false, encodedPacket => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
                callback(encodedPackets.join(SEPARATOR));
            }
        });
    });
};
exports.encodePayload = encodePayload;
const decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR);
    const packets = [];
    for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = (0, decodePacket_js_1.default)(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
            break;
        }
    }
    return packets;
};
exports.decodePayload = decodePayload;
exports.protocol = 4;

},{"./decodePacket.js":33,"./encodePacket.js":34}],36:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],37:[function(require,module,exports){
(function (process,global){(function (){
/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }
})();

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":39}],38:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],39:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],40:[function(require,module,exports){
(function (process,global,Buffer){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bson = require('bson');

function _interopNamespace(e) {
    if (e && e.__esModule) { return e; } else {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }
}

var bson__namespace = /*#__PURE__*/_interopNamespace(bson);

var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BrowserInfo = /** @class */ (function () {
    function BrowserInfo(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = 'browser';
    }
    return BrowserInfo;
}());
var NodeInfo = /** @class */ (function () {
    function NodeInfo(version) {
        this.version = version;
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
    return NodeInfo;
}());
var SearchBotDeviceInfo = /** @class */ (function () {
    function SearchBotDeviceInfo(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = 'bot-device';
    }
    return SearchBotDeviceInfo;
}());
var BotInfo = /** @class */ (function () {
    function BotInfo() {
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
    return BotInfo;
}());
var ReactNativeInfo = /** @class */ (function () {
    function ReactNativeInfo() {
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
    return ReactNativeInfo;
}());
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FB[AS]V\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['curl', /^curl\/([0-9\.]+)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['Android OS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['Amazon OS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Open BSD', /OpenBSD/],
    ['Sun OS', /SunOS/],
    ['Chrome OS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
function detect(userAgent) {
    if (!!userAgent) {
        return parseUserAgent(userAgent);
    }
    if (typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return new ReactNativeInfo();
    }
    if (typeof navigator !== 'undefined') {
        return parseUserAgent(navigator.userAgent);
    }
    return getNodeVersion();
}
function matchUserAgent(ua) {
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (ua !== '' &&
        userAgentRules.reduce(function (matched, _a) {
            var browser = _a[0], regex = _a[1];
            if (matched) {
                return matched;
            }
            var uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false));
}
function parseUserAgent(ua) {
    var matchedRule = matchUserAgent(ua);
    if (!matchedRule) {
        return null;
    }
    var name = matchedRule[0], match = matchedRule[1];
    if (name === 'searchbot') {
        return new BotInfo();
    }
    // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
    var versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
        }
    }
    else {
        versionParts = [];
    }
    var version = versionParts.join('.');
    var os = detectOS(ua);
    var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
    for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
            return os;
        }
    }
    return null;
}
function getNodeVersion() {
    var isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
    var output = [];
    for (var ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
class DefaultNetworkTransport {
    constructor() {
        if (!DefaultNetworkTransport.fetch) {
            throw new Error("DefaultNetworkTransport.fetch must be set before it's used");
        }
        if (!DefaultNetworkTransport.AbortController) {
            throw new Error("DefaultNetworkTransport.AbortController must be set before it's used");
        }
    }
    fetchWithCallbacks(request, handler) {
        // tslint:disable-next-line: no-console
        this.fetch(request)
            .then(async (response) => {
            const decodedBody = await response.text();
            // Pull out the headers of the response
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            return {
                statusCode: response.status,
                headers: responseHeaders,
                body: decodedBody,
            };
        })
            .then((r) => handler.onSuccess(r))
            .catch((e) => handler.onError(e));
    }
    async fetch(request) {
        const { timeoutMs, url, ...rest } = request;
        const { signal, cancelTimeout } = this.createTimeoutSignal(timeoutMs);
        try {
            // We'll await the response to catch throw our own error
            return await DefaultNetworkTransport.fetch(url, {
                ...DefaultNetworkTransport.extraFetchOptions,
                signal,
                ...rest,
            });
        }
        finally {
            // Whatever happens, cancel any timeout
            cancelTimeout();
        }
    }
    createTimeoutSignal(timeoutMs) {
        if (typeof timeoutMs === "number") {
            const controller = new DefaultNetworkTransport.AbortController();
            // Call abort after a specific number of milliseconds
            const timeout = setTimeout(() => {
                controller.abort();
            }, timeoutMs);
            return {
                signal: controller.signal,
                cancelTimeout: () => {
                    clearTimeout(timeout);
                },
            };
        }
        else {
            return {
                signal: undefined,
                cancelTimeout: () => {
                    /* No-op */
                },
            };
        }
    }
}
DefaultNetworkTransport.DEFAULT_HEADERS = {
    "Content-Type": "application/json",
};

////////////////////////////////////////////////////////////////////////////
/**
 * Set the value of `isDevelopmentMode`. This allows each entry point (node vs DOM)
 * to use its own method for determining whether we are in development mode.
 *
 * @param state A boolean indicating whether the user's app is running in
 * development mode or not.
 */
const setIsDevelopmentMode = (state) => {
};

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
// Exports a globalThis which is polyfilled for iOS 11/12
// From https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/global.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const check = function (it) {
    return it && it.Math == Math && it;
};
// eslint-disable-next-line no-restricted-globals
const safeGlobalThis = 
// eslint-disable-next-line no-restricted-globals
check(typeof globalThis == "object" && globalThis) ||
    check(typeof window == "object" && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore allow `self`
    check(typeof self == "object" && self) ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore allow `global`
    check(typeof global == "object" && global) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore allow `this`
        return this;
    })() ||
    Function("return this")();

////////////////////////////////////////////////////////////////////////////
// React/React Native set a global __DEV__ variable when running in dev mode
setIsDevelopmentMode(typeof __DEV__ !== "undefined" && __DEV__);

////////////////////////////////////////////////////////////////////////////
DefaultNetworkTransport.fetch = safeGlobalThis.fetch.bind(safeGlobalThis);
DefaultNetworkTransport.AbortController = safeGlobalThis.AbortController.bind(safeGlobalThis);

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.2';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a), c => c.charCodeAt(0));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins,
};

////////////////////////////////////////////////////////////////////////////
const SERIALIZATION_OPTIONS = {
    relaxed: false, // Ensure Canonical mode
};
/**
 * Serialize an object containing BSON types into extended-JSON.
 *
 * @param obj The object containing BSON types.
 * @returns The document in extended-JSON format.
 */
function serialize(obj) {
    return bson.EJSON.serialize(obj, SERIALIZATION_OPTIONS);
}
/**
 * De-serialize an object or an array of object from extended-JSON into an object or an array of object with BSON types.
 *
 * @param obj The object or array of objects in extended-JSON format.
 * @returns The object or array of objects with inflated BSON types.
 */
function deserialize(obj) {
    if (Array.isArray(obj)) {
        return obj.map((doc) => bson.EJSON.deserialize(doc));
    }
    else {
        return bson.EJSON.deserialize(obj);
    }
}

////////////////////////////////////////////////////////////////////////////
/**
 * The type of a user.
 */
var UserType;
(function (UserType) {
    /**
     * A normal end-user created this user.
     */
    UserType["Normal"] = "normal";
    /**
     * The user was created by the server.
     */
    UserType["Server"] = "server";
})(UserType || (UserType = {}));
/** @ignore */
var DataKey;
(function (DataKey) {
    /** @ignore */
    DataKey["NAME"] = "name";
    /** @ignore */
    DataKey["EMAIL"] = "email";
    /** @ignore */
    DataKey["PICTURE"] = "picture";
    /** @ignore */
    DataKey["FIRST_NAME"] = "first_name";
    /** @ignore */
    DataKey["LAST_NAME"] = "last_name";
    /** @ignore */
    DataKey["GENDER"] = "gender";
    /** @ignore */
    DataKey["BIRTHDAY"] = "birthday";
    /** @ignore */
    DataKey["MIN_AGE"] = "min_age";
    /** @ignore */
    DataKey["MAX_AGE"] = "max_age";
})(DataKey || (DataKey = {}));
const DATA_MAPPING = {
    [DataKey.NAME]: "name",
    [DataKey.EMAIL]: "email",
    [DataKey.PICTURE]: "pictureUrl",
    [DataKey.FIRST_NAME]: "firstName",
    [DataKey.LAST_NAME]: "lastName",
    [DataKey.GENDER]: "gender",
    [DataKey.BIRTHDAY]: "birthday",
    [DataKey.MIN_AGE]: "minAge",
    [DataKey.MAX_AGE]: "maxAge",
};
/** @inheritdoc */
class UserProfile {
    /**
     * @param response The response of a call fetching the users profile.
     */
    constructor(response) {
        /** @ignore */
        this.type = UserType.Normal;
        /** @ignore */
        this.identities = [];
        if (typeof response === "object" && response !== null) {
            const { type, identities, data } = response;
            if (typeof type === "string") {
                this.type = type;
            }
            else {
                throw new Error("Expected 'type' in the response body");
            }
            if (Array.isArray(identities)) {
                this.identities = identities.map((identity) => {
                    const { id, provider_type: providerType } = identity;
                    return { id, providerType };
                });
            }
            else {
                throw new Error("Expected 'identities' in the response body");
            }
            if (typeof data === "object" && data !== null) {
                const mappedData = Object.fromEntries(Object.entries(data).map(([key, value]) => {
                    if (key in DATA_MAPPING) {
                        // Translate any known data field to its JS idiomatic alias
                        return [DATA_MAPPING[key], value];
                    }
                    else {
                        // Pass through any other values
                        return [key, value];
                    }
                }));
                // We can use `any` since we trust the user supplies the correct type
                this.data = deserialize(mappedData);
            }
            else {
                throw new Error("Expected 'data' in the response body");
            }
        }
        else {
            this.data = {};
        }
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
/**
 * A `Storage` which will prefix a key part to every operation.
 */
class PrefixedStorage {
    /**
     * Construct a `Storage` which will prefix a key part to every operation.
     *
     * @param storage The underlying storage to use for operations.
     * @param keyPart The part of the key to prefix when performing operations.
     */
    constructor(storage, keyPart) {
        this.storage = storage;
        this.keyPart = keyPart;
    }
    /** @inheritdoc */
    get(key) {
        return this.storage.get(this.keyPart + PrefixedStorage.PART_SEPARATOR + key);
    }
    /** @inheritdoc */
    set(key, value) {
        return this.storage.set(this.keyPart + PrefixedStorage.PART_SEPARATOR + key, value);
    }
    /** @inheritdoc */
    remove(key) {
        return this.storage.remove(this.keyPart + PrefixedStorage.PART_SEPARATOR + key);
    }
    /** @inheritdoc */
    prefix(keyPart) {
        return new PrefixedStorage(this, keyPart);
    }
    /** @inheritdoc */
    clear(prefix = "") {
        return this.storage.clear(this.keyPart + PrefixedStorage.PART_SEPARATOR + prefix);
    }
    /** @inheritdoc */
    addListener(listener) {
        return this.storage.addListener(listener);
    }
    /** @inheritdoc */
    removeListener(listener) {
        return this.storage.addListener(listener);
    }
}
/**
 * The string separating two parts.
 */
PrefixedStorage.PART_SEPARATOR = ":";

////////////////////////////////////////////////////////////////////////////
/**
 * In-memory storage that will not be persisted.
 */
class MemoryStorage {
    constructor() {
        /**
         * Internal state of the storage.
         */
        this.storage = {};
        /**
         * A set of listners.
         */
        this.listeners = new Set();
    }
    /** @inheritdoc */
    get(key) {
        if (key in this.storage) {
            return this.storage[key];
        }
        else {
            return null;
        }
    }
    /** @inheritdoc */
    set(key, value) {
        this.storage[key] = value;
        // Fire the listeners
        this.fireListeners();
    }
    /** @inheritdoc */
    remove(key) {
        delete this.storage[key];
        // Fire the listeners
        this.fireListeners();
    }
    /** @inheritdoc */
    prefix(keyPart) {
        return new PrefixedStorage(this, keyPart);
    }
    /** @inheritdoc */
    clear(prefix) {
        // Iterate all keys and delete their values if they have a matching prefix
        for (const key of Object.keys(this.storage)) {
            if (!prefix || key.startsWith(prefix)) {
                delete this.storage[key];
            }
        }
        // Fire the listeners
        this.fireListeners();
    }
    /** @inheritdoc */
    addListener(listener) {
        this.listeners.add(listener);
    }
    /** @inheritdoc */
    removeListener(listener) {
        this.listeners.delete(listener);
    }
    /**
     * Tell the listeners that a change occurred.
     */
    fireListeners() {
        this.listeners.forEach((listener) => listener());
    }
}

////////////////////////////////////////////////////////////////////////////
const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";
const PROFILE_STORAGE_KEY = "profile";
const PROVIDER_TYPE_STORAGE_KEY = "providerType";
/**
 * Storage specific to the app.
 */
class UserStorage extends PrefixedStorage {
    /**
     * Construct a storage for a `User`.
     *
     * @param storage The underlying storage to wrap.
     * @param userId The id of the user.
     */
    constructor(storage, userId) {
        super(storage, `user(${userId})`);
    }
    /**
     * Get the access token from storage.
     *
     * @returns Access token (null if unknown).
     */
    get accessToken() {
        return this.get(ACCESS_TOKEN_STORAGE_KEY);
    }
    /**
     * Set the access token in storage.
     *
     * @param value Access token (null if unknown).
     */
    set accessToken(value) {
        if (value === null) {
            this.remove(ACCESS_TOKEN_STORAGE_KEY);
        }
        else {
            this.set(ACCESS_TOKEN_STORAGE_KEY, value);
        }
    }
    /**
     * Get the refresh token from storage.
     *
     * @returns Refresh token (null if unknown and user is logged out).
     */
    get refreshToken() {
        return this.get(REFRESH_TOKEN_STORAGE_KEY);
    }
    /**
     * Set the refresh token in storage.
     *
     * @param value Refresh token (null if unknown and user is logged out).
     */
    set refreshToken(value) {
        if (value === null) {
            this.remove(REFRESH_TOKEN_STORAGE_KEY);
        }
        else {
            this.set(REFRESH_TOKEN_STORAGE_KEY, value);
        }
    }
    /**
     * Get the user profile from storage.
     *
     * @returns User profile (undefined if its unknown).
     */
    get profile() {
        const value = this.get(PROFILE_STORAGE_KEY);
        if (value) {
            const profile = new UserProfile();
            // Patch in the values
            Object.assign(profile, JSON.parse(value));
            return profile;
        }
    }
    /**
     * Set the user profile in storage.
     *
     * @param value User profile (undefined if its unknown).
     */
    set profile(value) {
        if (value) {
            this.set(PROFILE_STORAGE_KEY, JSON.stringify(value));
        }
        else {
            this.remove(PROFILE_STORAGE_KEY);
        }
    }
    /**
     * Get the type of authentication provider used to authenticate
     *
     * @returns User profile (undefined if its unknown).
     */
    get providerType() {
        const value = this.get(PROVIDER_TYPE_STORAGE_KEY);
        if (value) {
            return value;
        }
    }
    /**
     * Set the type of authentication provider used to authenticate
     *
     * @param value Type of authentication provider.
     */
    set providerType(value) {
        if (value) {
            this.set(PROVIDER_TYPE_STORAGE_KEY, value);
        }
        else {
            this.remove(PROVIDER_TYPE_STORAGE_KEY);
        }
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
/**
 * @param obj The object to remove keys (and undefined values from)
 * @returns A new object without the keys where the value is undefined.
 */
function removeKeysWithUndefinedValues(obj) {
    return Object.fromEntries(Object.entries(obj).filter((entry) => typeof entry[1] !== "undefined"));
}

////////////////////////////////////////////////////////////////////////////
/**
 * Generate a random sequence of characters.
 *
 * @param length The length of the string.
 * @param alphabet The alphabet of characters to pick from.
 * @returns A string of characters picked randomly from `alphabet`.
 */
function generateRandomString(length, alphabet) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
}
/**
 * Encode an object mapping from string to string, into a query string to be appended a URL.
 *
 * @param params The parameters to include in the string.
 * @param prefixed Should the "?" prefix be added if values exists?
 * @returns A URL encoded representation of the parameters (omitting a "?" prefix).
 */
function encodeQueryString(params, prefixed = true) {
    // Filter out undefined values
    const cleanedParams = removeKeysWithUndefinedValues(params);
    // Determine if a prefixed "?" is appropreate
    const prefix = prefixed && Object.keys(cleanedParams).length > 0 ? "?" : "";
    // Transform keys and values to a query string
    return (prefix +
        Object.entries(cleanedParams)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join("&"));
}
/**
 * Decodes a query string into an object.
 *
 * @param str The query string to decode.
 * @returns The decoded query string.
 */
function decodeQueryString(str) {
    const cleanStr = str[0] === "?" ? str.substr(1) : str;
    return Object.fromEntries(cleanStr
        .split("&")
        .filter((s) => s.length > 0)
        .map((kvp) => kvp.split("="))
        .map(([k, v]) => [k, decodeURIComponent(v)]));
}

////////////////////////////////////////////////////////////////////////////
/**
 * A list of names that functions cannot have to be callable through the functions proxy.
 */
const RESERVED_NAMES = [
    "inspect",
    "callFunction",
    "callFunctionStreaming",
    // Methods defined on the Object.prototype might be "typeof probed" and called by libraries and runtime environments.
    ...Object.getOwnPropertyNames(Object.prototype),
];
/**
 * Remove the key for any fields with undefined values.
 *
 * @param args The arguments to clean.
 * @returns The cleaned arguments.
 */
function cleanArgs(args) {
    for (const arg of args) {
        if (typeof arg === "object" && arg) {
            for (const [key, value] of Object.entries(arg)) {
                if (value === undefined) {
                    delete arg[key];
                }
            }
        }
    }
    return args;
}
/**
 * Remove keys for any undefined values and serialize to EJSON.
 *
 * @param args The arguments to clean and serialize.
 * @returns The cleaned and serialized arguments.
 */
function cleanArgsAndSerialize(args) {
    const cleaned = cleanArgs(args);
    return cleaned.map((arg) => (typeof arg === "object" ? serialize(arg) : arg));
}
/**
 * Defines how functions are called.
 */
class FunctionsFactory {
    /**
     * @param fetcher The underlying fetcher to use when sending requests.
     * @param config Additional configuration parameters.
     */
    constructor(fetcher, config = {}) {
        this.fetcher = fetcher;
        this.serviceName = config.serviceName;
        this.argsTransformation = config.argsTransformation || cleanArgsAndSerialize;
    }
    /**
     * Create a factory of functions, wrapped in a Proxy that returns bound copies of `callFunction` on any property.
     *
     * @param fetcher The underlying fetcher to use when requesting.
     * @param config Additional configuration parameters.
     * @returns The newly created factory of functions.
     */
    static create(fetcher, config = {}) {
        // Create a proxy, wrapping a simple object returning methods that calls functions
        // TODO: Lazily fetch available functions and return these from the ownKeys() trap
        const factory = new FunctionsFactory(fetcher, config);
        // Wrap the factory in a proxy that calls the internal call method
        return new Proxy(factory, {
            get(target, p, receiver) {
                if (typeof p === "string" && RESERVED_NAMES.indexOf(p) === -1) {
                    return target.callFunction.bind(target, p);
                }
                else {
                    const prop = Reflect.get(target, p, receiver);
                    return typeof prop === "function" ? prop.bind(target) : prop;
                }
            },
        });
    }
    /**
     * Call a remote function by it's name.
     *
     * @param name Name of the remote function.
     * @param args Arguments to pass to the remote function.
     * @returns A promise of the value returned when executing the remote function.
     */
    async callFunction(name, ...args) {
        // See https://github.com/mongodb/stitch-js-sdk/blob/master/packages/core/sdk/src/services/internal/CoreStitchServiceClientImpl.ts
        const body = {
            name,
            arguments: this.argsTransformation ? this.argsTransformation(args) : args,
        };
        if (this.serviceName) {
            body.service = this.serviceName;
        }
        const appRoute = this.fetcher.appRoute;
        return this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.functionsCall().path,
            body,
        });
    }
    /**
     * Call a remote function by it's name.
     *
     * @param name Name of the remote function.
     * @param args Arguments to pass to the remote function.
     * @returns A promise of the value returned when executing the remote function.
     */
    callFunctionStreaming(name, ...args) {
        const body = {
            name,
            arguments: this.argsTransformation ? this.argsTransformation(args) : args,
        };
        if (this.serviceName) {
            body.service = this.serviceName;
        }
        const appRoute = this.fetcher.appRoute;
        const qs = encodeQueryString({
            ["baas_request"]: gBase64.encode(JSON.stringify(body)),
        });
        return this.fetcher.fetchStream({
            method: "GET",
            path: appRoute.functionsCall().path + qs,
        });
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
/** @inheritdoc */
class EmailPasswordAuth {
    /**
     * Construct an interface to the email / password authentication provider.
     *
     * @param fetcher The underlying fetcher used to request the services.
     * @param providerName Optional custom name of the authentication provider.
     */
    constructor(fetcher, providerName = "local-userpass") {
        this.fetcher = fetcher;
        this.providerName = providerName;
    }
    /** @inheritdoc */
    async registerUser(details) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).register().path,
            body: details,
        });
    }
    /** @inheritdoc */
    async confirmUser(details) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).confirm().path,
            body: details,
        });
    }
    /** @inheritdoc */
    async resendConfirmationEmail(details) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).confirmSend().path,
            body: details,
        });
    }
    /** @inheritdoc */
    async retryCustomConfirmation(details) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).confirmCall().path,
            body: details,
        });
    }
    /** @inheritdoc */
    async resetPassword(details) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).reset().path,
            body: details,
        });
    }
    /** @inheritdoc */
    async sendResetPasswordEmail(details) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).resetSend().path,
            body: details,
        });
    }
    /** @inheritdoc */
    async callResetPasswordFunction(details, ...args) {
        const appRoute = this.fetcher.appRoute;
        await this.fetcher.fetchJSON({
            method: "POST",
            path: appRoute.emailPasswordAuth(this.providerName).resetCall().path,
            body: { ...details, arguments: args },
        });
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
/**
 * @returns The base api route.
 */
function api() {
    return {
        path: "/api/client/v2.0",
        /**
         * @param appId The id of the app.
         * @returns The URL of the app endpoint.
         */
        app(appId) {
            return {
                path: this.path + `/app/${appId}`,
                /**
                 * @returns The URL of the app location endpoint.
                 */
                location() {
                    return {
                        path: this.path + "/location",
                    };
                },
                /**
                 * @param providerName The name of the provider.
                 * @returns The app url concatinated with the /auth/providers/{providerName}
                 */
                authProvider(providerName) {
                    return {
                        path: this.path + `/auth/providers/${providerName}`,
                        /**
                         * @returns Get the URL of an authentication provider.
                         */
                        login() {
                            return { path: this.path + "/login" };
                        },
                    };
                },
                /**
                 * @param providerName The name of the provider.
                 * @returns The app url concatinated with the /auth/providers/{providerName}
                 */
                emailPasswordAuth(providerName) {
                    const authProviderRoutes = this.authProvider(providerName);
                    return {
                        ...authProviderRoutes,
                        register() {
                            return { path: this.path + "/register" };
                        },
                        confirm() {
                            return { path: this.path + "/confirm" };
                        },
                        confirmSend() {
                            return { path: this.path + "/confirm/send" };
                        },
                        confirmCall() {
                            return { path: this.path + "/confirm/call" };
                        },
                        reset() {
                            return { path: this.path + "/reset" };
                        },
                        resetSend() {
                            return { path: this.path + "/reset/send" };
                        },
                        resetCall() {
                            return { path: this.path + "/reset/call" };
                        },
                    };
                },
                functionsCall() {
                    return {
                        path: this.path + "/functions/call",
                    };
                },
            };
        },
        auth() {
            return {
                path: this.path + "/auth",
                apiKeys() {
                    return {
                        path: this.path + "/api_keys",
                        key(id) {
                            return {
                                path: this.path + `/${id}`,
                                enable() {
                                    return { path: this.path + "/enable" };
                                },
                                disable() {
                                    return { path: this.path + "/disable" };
                                },
                            };
                        },
                    };
                },
                profile() {
                    return { path: this.path + "/profile" };
                },
                session() {
                    return { path: this.path + "/session" };
                },
                delete() {
                    return { path: this.path + "/delete" };
                },
            };
        },
    };
}
var routes = { api };

////////////////////////////////////////////////////////////////////////////
/** @inheritdoc */
class ApiKeyAuth {
    /**
     * Construct an interface to the API-key authentication provider.
     *
     * @param fetcher The fetcher used to send requests to services.
     */
    constructor(fetcher) {
        this.fetcher = fetcher;
    }
    /** @inheritdoc */
    create(name) {
        return this.fetcher.fetchJSON({
            method: "POST",
            body: { name },
            path: routes.api().auth().apiKeys().path,
            tokenType: "refresh",
        });
    }
    /** @inheritdoc */
    fetch(keyId) {
        return this.fetcher.fetchJSON({
            method: "GET",
            path: routes.api().auth().apiKeys().key(keyId).path,
            tokenType: "refresh",
        });
    }
    /** @inheritdoc */
    fetchAll() {
        return this.fetcher.fetchJSON({
            method: "GET",
            tokenType: "refresh",
            path: routes.api().auth().apiKeys().path,
        });
    }
    /** @inheritdoc */
    async delete(keyId) {
        await this.fetcher.fetchJSON({
            method: "DELETE",
            path: routes.api().auth().apiKeys().key(keyId).path,
            tokenType: "refresh",
        });
    }
    /** @inheritdoc */
    async enable(keyId) {
        await this.fetcher.fetchJSON({
            method: "PUT",
            path: routes.api().auth().apiKeys().key(keyId).enable().path,
            tokenType: "refresh",
        });
    }
    /** @inheritdoc */
    async disable(keyId) {
        await this.fetcher.fetchJSON({
            method: "PUT",
            path: routes.api().auth().apiKeys().key(keyId).disable().path,
            tokenType: "refresh",
        });
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
let environment = null;
/**
 * Set the environment of execution.
 * Note: This should be called as the first thing before executing any code which calls getEnvironment()
 *
 * @param e An object containing environment specific implementations.
 */
function setEnvironment(e) {
    environment = e;
}
/**
 * Get the environment of execution.
 *
 * @returns An object containing environment specific implementations.
 */
function getEnvironment() {
    if (environment) {
        return environment;
    }
    else {
        throw new Error("Cannot get environment before it's set");
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
/**
 * An error occured during the parsing of a watch stream.
 */
class WatchError extends Error {
    constructor({ message, code }) {
        super(message);
        /**
         * The name of this type of error
         */
        this.name = "WatchError";
        this.code = code;
    }
}

////////////////////////////////////////////////////////////////////////////
// NOTE: this is a fully processed event, not a single "data: foo" line!
/**
 * The state of a WatchStream.
 */
var WatchStreamState;
(function (WatchStreamState) {
    /**
     * Need to call one of the feed functions.
     */
    WatchStreamState["NEED_DATA"] = "NEED_DATA";
    /**
     * Call nextEvent() to consume an event.
     */
    WatchStreamState["HAVE_EVENT"] = "HAVE_EVENT";
    /**
     * Call error().
     */
    WatchStreamState["HAVE_ERROR"] = "HAVE_ERROR";
})(WatchStreamState || (WatchStreamState = {}));
/**
 * Represents a stream of events
 */
class WatchStream {
    constructor() {
        this._state = WatchStreamState.NEED_DATA;
        this._error = null;
        // Used by feedBuffer to construct lines
        this._textDecoder = new (getEnvironment().TextDecoder)();
        this._buffer = "";
        this._bufferOffset = 0;
        // Used by feedLine for building the next SSE
        this._eventType = "";
        this._dataBuffer = "";
    }
    // Call these when you have data, in whatever shape is easiest for your SDK to get.
    // Pick one, mixing and matching on a single instance isn't supported.
    // These can only be called in NEED_DATA state, which is the initial state.
    feedBuffer(buffer) {
        this.assertState(WatchStreamState.NEED_DATA);
        this._buffer += this._textDecoder.decode(buffer, { stream: true });
        this.advanceBufferState();
    }
    feedLine(line) {
        this.assertState(WatchStreamState.NEED_DATA);
        // This is an implementation of the algorithm described at
        // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation.
        // Currently the server does not use id or retry lines, so that processing isn't implemented.
        // ignore trailing LF if not removed by SDK.
        if (line.endsWith("\n"))
            line = line.substr(0, line.length - 1);
        // ignore trailing CR from CRLF
        if (line.endsWith("\r"))
            line = line.substr(0, line.length - 1);
        if (line.length === 0) {
            // This is the "dispatch the event" portion of the algorithm.
            if (this._dataBuffer.length === 0) {
                this._eventType = "";
                return;
            }
            if (this._dataBuffer.endsWith("\n"))
                this._dataBuffer = this._dataBuffer.substr(0, this._dataBuffer.length - 1);
            this.feedSse({
                data: this._dataBuffer,
                eventType: this._eventType,
            });
            this._dataBuffer = "";
            this._eventType = "";
        }
        if (line[0] === ":")
            return;
        const colon = line.indexOf(":");
        const field = line.substr(0, colon);
        let value = colon === -1 ? "" : line.substr(colon + 1);
        if (value.startsWith(" "))
            value = value.substr(1);
        if (field === "event") {
            this._eventType = value;
        }
        else if (field === "data") {
            this._dataBuffer += value;
            this._dataBuffer += "\n";
        }
        else ;
    }
    feedSse(sse) {
        this.assertState(WatchStreamState.NEED_DATA);
        const firstPercentIndex = sse.data.indexOf("%");
        if (firstPercentIndex !== -1) {
            // For some reason, the stich server decided to add percent-encoding for '%', '\n', and '\r' to its
            // event-stream replies. But it isn't real urlencoding, since most characters pass through, so we can't use
            // uri_percent_decode() here.
            let buffer = "";
            let start = 0;
            for (let percentIndex = firstPercentIndex; percentIndex !== -1; percentIndex = sse.data.indexOf("%", start)) {
                buffer += sse.data.substr(start, percentIndex - start);
                const encoded = sse.data.substr(percentIndex, 3); // may be smaller than 3 if string ends with %
                if (encoded === "%25") {
                    buffer += "%";
                }
                else if (encoded === "%0A") {
                    buffer += "\x0A"; // '\n'
                }
                else if (encoded === "%0D") {
                    buffer += "\x0D"; // '\r'
                }
                else {
                    buffer += encoded; // propagate as-is
                }
                start = percentIndex + encoded.length;
            }
            // Advance the buffer with the last part
            buffer += sse.data.substr(start);
            sse.data = buffer;
        }
        if (!sse.eventType || sse.eventType === "message") {
            try {
                const parsed = bson.EJSON.parse(sse.data);
                if (typeof parsed === "object") {
                    // ???
                    this._nextEvent = parsed;
                    this._state = WatchStreamState.HAVE_EVENT;
                    return;
                }
            }
            catch {
                // fallthrough to same handling as for non-document value.
            }
            this._state = WatchStreamState.HAVE_ERROR;
            this._error = new WatchError({
                message: "server returned malformed event: " + sse.data,
                code: "bad bson parse",
            });
        }
        else if (sse.eventType === "error") {
            this._state = WatchStreamState.HAVE_ERROR;
            // default error message if we have issues parsing the reply.
            this._error = new WatchError({
                message: sse.data,
                code: "unknown",
            });
            try {
                const { error_code: errorCode, error } = bson.EJSON.parse(sse.data);
                if (typeof errorCode !== "string")
                    return;
                if (typeof error !== "string")
                    return;
                // XXX in realm-js, object-store will error if the error_code is not one of the known
                // error code enum values.
                this._error = new WatchError({
                    message: error,
                    code: errorCode,
                });
            }
            catch {
                return; // Use the default state.
            }
        }
        else ;
    }
    get state() {
        return this._state;
    }
    // Consumes the returned event. If you used feedBuffer(), there may be another event or error after this one,
    // so you need to call state() again to see what to do next.
    nextEvent() {
        this.assertState(WatchStreamState.HAVE_EVENT);
        // We can use "as ChangeEvent<T>" since we just asserted the state.
        const out = this._nextEvent;
        this._state = WatchStreamState.NEED_DATA;
        this.advanceBufferState();
        return out;
    }
    // Once this enters the error state, it stays that way. You should not feed any more data.
    get error() {
        return this._error;
    }
    ////////////////////////////////////////////
    advanceBufferState() {
        this.assertState(WatchStreamState.NEED_DATA);
        while (this.state === WatchStreamState.NEED_DATA) {
            if (this._bufferOffset === this._buffer.length) {
                this._buffer = "";
                this._bufferOffset = 0;
                return;
            }
            // NOTE not supporting CR-only newlines, just LF and CRLF.
            const nextNewlineIndex = this._buffer.indexOf("\n", this._bufferOffset);
            if (nextNewlineIndex === -1) {
                // We have a partial line.
                if (this._bufferOffset !== 0) {
                    // Slide the partial line down to the front of the buffer.
                    this._buffer = this._buffer.substr(this._bufferOffset, this._buffer.length - this._bufferOffset);
                    this._bufferOffset = 0;
                }
                return;
            }
            this.feedLine(this._buffer.substr(this._bufferOffset, nextNewlineIndex - this._bufferOffset));
            this._bufferOffset = nextNewlineIndex + 1; // Advance past this line, including its newline.
        }
    }
    assertState(state) {
        if (this._state !== state) {
            throw Error(`Expected WatchStream to be in state ${state}, but in state ${this._state}`);
        }
    }
}

////////////////////////////////////////////////////////////////////////////
/**
 * A remote collection of documents.
 */
class MongoDBCollection {
    /**
     * Construct a remote collection of documents.
     *
     * @param fetcher The fetcher to use when requesting the service.
     * @param serviceName The name of the remote service.
     * @param databaseName The name of the database.
     * @param collectionName The name of the remote collection.
     */
    constructor(fetcher, serviceName, databaseName, collectionName) {
        this.functions = FunctionsFactory.create(fetcher, {
            serviceName,
        });
        this.databaseName = databaseName;
        this.collectionName = collectionName;
        this.serviceName = serviceName;
        this.fetcher = fetcher;
    }
    /** @inheritdoc */
    find(filter = {}, options = {}) {
        return this.functions.find({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
            project: options.projection,
            sort: options.sort,
            limit: options.limit,
        });
    }
    /** @inheritdoc */
    findOne(filter = {}, options = {}) {
        return this.functions.findOne({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
            project: options.projection,
            sort: options.sort,
        });
    }
    /** @inheritdoc */
    findOneAndUpdate(filter = {}, update, options = {}) {
        return this.functions.findOneAndUpdate({
            database: this.databaseName,
            collection: this.collectionName,
            filter,
            update,
            sort: options.sort,
            projection: options.projection,
            upsert: options.upsert,
            returnNewDocument: options.returnNewDocument,
        });
    }
    /** @inheritdoc */
    findOneAndReplace(filter = {}, replacement, options = {}) {
        return this.functions.findOneAndReplace({
            database: this.databaseName,
            collection: this.collectionName,
            filter: filter,
            update: replacement,
            sort: options.sort,
            projection: options.projection,
            upsert: options.upsert,
            returnNewDocument: options.returnNewDocument,
        });
    }
    /** @inheritdoc */
    findOneAndDelete(filter = {}, options = {}) {
        return this.functions.findOneAndReplace({
            database: this.databaseName,
            collection: this.collectionName,
            filter,
            sort: options.sort,
            projection: options.projection,
        });
    }
    /** @inheritdoc */
    aggregate(pipeline) {
        return this.functions.aggregate({
            database: this.databaseName,
            collection: this.collectionName,
            pipeline,
        });
    }
    /** @inheritdoc */
    count(filter = {}, options = {}) {
        return this.functions.count({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
            limit: options.limit,
        });
    }
    /** @inheritdoc */
    insertOne(document) {
        return this.functions.insertOne({
            database: this.databaseName,
            collection: this.collectionName,
            document,
        });
    }
    /** @inheritdoc */
    insertMany(documents) {
        return this.functions.insertMany({
            database: this.databaseName,
            collection: this.collectionName,
            documents,
        });
    }
    /** @inheritdoc */
    deleteOne(filter = {}) {
        return this.functions.deleteOne({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
        });
    }
    /** @inheritdoc */
    deleteMany(filter = {}) {
        return this.functions.deleteMany({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
        });
    }
    /** @inheritdoc */
    updateOne(filter, update, options = {}) {
        return this.functions.updateOne({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
            update,
            upsert: options.upsert,
            arrayFilters: options.arrayFilters,
        });
    }
    /** @inheritdoc */
    updateMany(filter, update, options = {}) {
        return this.functions.updateMany({
            database: this.databaseName,
            collection: this.collectionName,
            query: filter,
            update,
            upsert: options.upsert,
            arrayFilters: options.arrayFilters,
        });
    }
    watch({ ids, filter, } = {}) {
        const iterable = this.functions.callFunctionStreaming("watch", {
            database: this.databaseName,
            collection: this.collectionName,
            ids,
            filter,
        });
        // Unpack the async iterable, making it possible for us to propagate the `return` when this generator is returning
        const iterator = iterable.then((i) => i[Symbol.asyncIterator]());
        const stream = this.watchImpl(iterator);
        // Store the original return on the stream, to enable propagating to the original implementation after we've returned on the iterator
        const originalReturn = stream.return;
        return Object.assign(stream, {
            return(value) {
                iterator.then((i) => (i.return ? i.return(value) : undefined));
                return originalReturn.call(stream, value);
            },
        });
    }
    /**
     * @param iterator An async iterator of the response body of a watch request.
     * @yields Change events.
     * Note: We had to split this from the `watch` method above to enable manually calling `return` on the response body iterator.
     */
    async *watchImpl(iterator) {
        const watchStream = new WatchStream();
        // Repack the iterator into an interable for the `watchImpl` to consume
        const iterable = iterator.then((i) => ({ [Symbol.asyncIterator]: () => i }));
        // Start consuming change events
        for await (const chunk of await iterable) {
            if (!chunk)
                continue;
            watchStream.feedBuffer(chunk);
            while (watchStream.state == WatchStreamState.HAVE_EVENT) {
                yield watchStream.nextEvent();
            }
            if (watchStream.state == WatchStreamState.HAVE_ERROR)
                // XXX this is just throwing an error like {error_code: "BadRequest, error: "message"},
                // which matches realm-js, but is different from how errors are handled in realm-web
                throw watchStream.error;
        }
    }
}

////////////////////////////////////////////////////////////////////////////
/**
 * Creates an Remote MongoDB Collection.
 * Note: This method exists to enable function binding.
 *
 * @param fetcher The underlying fetcher.
 * @param serviceName A service name.
 * @param databaseName A database name.
 * @param collectionName A collection name.
 * @returns The collection.
 */
function createCollection(fetcher, serviceName, databaseName, collectionName) {
    return new MongoDBCollection(fetcher, serviceName, databaseName, collectionName);
}
/**
 * Creates a Remote MongoDB Database.
 * Note: This method exists to enable function binding.
 *
 * @param fetcher The underlying fetcher
 * @param serviceName A service name
 * @param databaseName A database name
 * @returns The database.
 */
function createDatabase(fetcher, serviceName, databaseName) {
    return {
        collection: createCollection.bind(null, fetcher, serviceName, databaseName),
    };
}
/**
 * Creates a Remote MongoDB Service.
 * Note: This method exists to enable function binding.
 *
 * @param fetcher The underlying fetcher.
 * @param serviceName An optional service name.
 * @returns The service.
 */
function createService(fetcher, serviceName = "mongo-db") {
    return { db: createDatabase.bind(null, fetcher, serviceName) };
}

////////////////////////////////////////////////////////////////////////////
const DEFAULT_DEVICE_ID = "000000000000000000000000";
(function (UserState) {
    /** Active, with both access and refresh tokens */
    UserState["Active"] = "active";
    /** Logged out, but there might still be data persisted about the user, in the browser. */
    UserState["LoggedOut"] = "logged-out";
    /** Logged out and all data about the user has been removed. */
    UserState["Removed"] = "removed";
})(exports.UserState || (exports.UserState = {}));
(function (UserType) {
    /** Created by the user itself. */
    UserType["Normal"] = "normal";
    /** Created by an administrator of the app. */
    UserType["Server"] = "server";
})(exports.UserType || (exports.UserType = {}));
/**
 * Representation of an authenticated user of an app.
 */
class User {
    /**
     * @param parameters Parameters of the user.
     */
    constructor(parameters) {
        this.app = parameters.app;
        this.id = parameters.id;
        this.storage = new UserStorage(this.app.storage, this.id);
        if ("accessToken" in parameters && "refreshToken" in parameters && "providerType" in parameters) {
            this._accessToken = parameters.accessToken;
            this._refreshToken = parameters.refreshToken;
            this.providerType = parameters.providerType;
            // Save the parameters to storage, for future instances to be hydrated from
            this.storage.accessToken = parameters.accessToken;
            this.storage.refreshToken = parameters.refreshToken;
            this.storage.providerType = parameters.providerType;
        }
        else {
            // Hydrate the rest of the parameters from storage
            this._accessToken = this.storage.accessToken;
            this._refreshToken = this.storage.refreshToken;
            const providerType = this.storage.providerType;
            this._profile = this.storage.profile;
            if (providerType) {
                this.providerType = providerType;
            }
            else {
                throw new Error("Storage is missing a provider type");
            }
        }
        this.fetcher = this.app.fetcher.clone({
            userContext: { currentUser: this },
        });
        this.apiKeys = new ApiKeyAuth(this.fetcher);
        this.functions = FunctionsFactory.create(this.fetcher);
    }
    /**
     * @returns The access token used to authenticate the user towards Atlas App Services.
     */
    get accessToken() {
        return this._accessToken;
    }
    /**
     * @param token The new access token.
     */
    set accessToken(token) {
        this._accessToken = token;
        this.storage.accessToken = token;
    }
    /**
     * @returns The refresh token used to issue new access tokens.
     */
    get refreshToken() {
        return this._refreshToken;
    }
    /**
     * @param token The new refresh token.
     */
    set refreshToken(token) {
        this._refreshToken = token;
        this.storage.refreshToken = token;
    }
    /**
     * @returns The current state of the user.
     */
    get state() {
        if (this.id in this.app.allUsers) {
            return this.refreshToken === null ? exports.UserState.LoggedOut : exports.UserState.Active;
        }
        else {
            return exports.UserState.Removed;
        }
    }
    /**
     * @returns The logged in state of the user.
     */
    get isLoggedIn() {
        return this.state === exports.UserState.Active;
    }
    get customData() {
        if (this.accessToken) {
            const decodedToken = this.decodeAccessToken();
            return decodedToken.userData;
        }
        else {
            throw new Error("Cannot read custom data without an access token");
        }
    }
    /**
     * @returns Profile containing detailed information about the user.
     */
    get profile() {
        if (this._profile) {
            return this._profile.data;
        }
        else {
            throw new Error("A profile was never fetched for this user");
        }
    }
    get identities() {
        if (this._profile) {
            return this._profile.identities;
        }
        else {
            throw new Error("A profile was never fetched for this user");
        }
    }
    get deviceId() {
        if (this.accessToken) {
            const payload = this.accessToken.split(".")[1];
            if (payload) {
                const parsedPayload = JSON.parse(gBase64.decode(payload));
                const deviceId = parsedPayload["baas_device_id"];
                if (typeof deviceId === "string" && deviceId !== DEFAULT_DEVICE_ID) {
                    return deviceId;
                }
            }
        }
        return null;
    }
    /**
     * Refresh the users profile data.
     */
    async refreshProfile() {
        // Fetch the latest profile
        const response = await this.fetcher.fetchJSON({
            method: "GET",
            path: routes.api().auth().profile().path,
        });
        // Create a profile instance
        this._profile = new UserProfile(response);
        // Store this for later hydration
        this.storage.profile = this._profile;
    }
    /**
     * Log out the user, invalidating the session (and its refresh token).
     */
    async logOut() {
        // Invalidate the refresh token
        try {
            if (this._refreshToken !== null) {
                await this.fetcher.fetchJSON({
                    method: "DELETE",
                    path: routes.api().auth().session().path,
                    tokenType: "refresh",
                });
            }
        }
        catch (err) {
            // Ignore failing to delete a missing refresh token
            // It might have expired or it might be gone due to the user being deleted
            if (!(err instanceof Error) || !err.message.includes("failed to find refresh token")) {
                throw err;
            }
        }
        finally {
            // Forget the access and refresh token
            this.accessToken = null;
            this.refreshToken = null;
        }
    }
    /** @inheritdoc */
    async linkCredentials(credentials) {
        const response = await this.app.authenticator.authenticate(credentials, this);
        // Sanity check the response
        if (this.id !== response.userId) {
            const details = `got user id ${response.userId} expected ${this.id}`;
            throw new Error(`Link response ment for another user (${details})`);
        }
        // Update the access token
        this.accessToken = response.accessToken;
        // Refresh the profile to include the new identity
        await this.refreshProfile();
    }
    /**
     * Request a new access token, using the refresh token.
     */
    async refreshAccessToken() {
        const response = await this.fetcher.fetchJSON({
            method: "POST",
            path: routes.api().auth().session().path,
            tokenType: "refresh",
        });
        const { access_token: accessToken } = response;
        if (typeof accessToken === "string") {
            this.accessToken = accessToken;
        }
        else {
            throw new Error("Expected an 'access_token' in the response");
        }
    }
    /** @inheritdoc */
    async refreshCustomData() {
        await this.refreshAccessToken();
        return this.customData;
    }
    /**
     * @inheritdoc
     */
    addListener() {
        throw new Error("Not yet implemented");
    }
    /**
     * @inheritdoc
     */
    removeListener() {
        throw new Error("Not yet implemented");
    }
    /**
     * @inheritdoc
     */
    removeAllListeners() {
        throw new Error("Not yet implemented");
    }
    /** @inheritdoc */
    callFunction(name, ...args) {
        return this.functions.callFunction(name, ...args);
    }
    /**
     * @returns A plain ol' JavaScript object representation of the user.
     */
    toJSON() {
        return {
            id: this.id,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            profile: this._profile,
            state: this.state,
            customData: this.customData,
        };
    }
    /** @inheritdoc */
    push() {
        throw new Error("Not yet implemented");
    }
    /** @inheritdoc */
    mongoClient(serviceName) {
        return createService(this.fetcher, serviceName);
    }
    decodeAccessToken() {
        if (this.accessToken) {
            // Decode and spread the token
            const parts = this.accessToken.split(".");
            if (parts.length !== 3) {
                throw new Error("Expected an access token with three parts");
            }
            // Decode the payload
            const encodedPayload = parts[1];
            const decodedPayload = gBase64.decode(encodedPayload);
            const parsedPayload = JSON.parse(decodedPayload);
            const { exp: expires, iat: issuedAt, sub: subject, user_data: userData = {} } = parsedPayload;
            // Validate the types
            if (typeof expires !== "number") {
                throw new Error("Failed to decode access token 'exp'");
            }
            else if (typeof issuedAt !== "number") {
                throw new Error("Failed to decode access token 'iat'");
            }
            return { expires, issuedAt, subject, userData };
        }
        else {
            throw new Error("Missing an access token");
        }
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
// TODO: Ensure the static interface of the Credentials class implements the static interface of Realm.Credentials
// See https://stackoverflow.com/a/43484801
/**
 * Instances of this class can be passed to the `app.logIn` method to authenticate an end-user.
 */
class Credentials {
    /**
     * Constructs an instance of credentials.
     *
     * @param providerName The name of the authentication provider used when authenticating.
     * @param providerType The type of the authentication provider used when authenticating.
     * @param payload The data being sent to the service when authenticating.
     */
    constructor(providerName, providerType, payload) {
        this.providerName = providerName;
        this.providerType = providerType;
        this.payload = payload;
    }
    /**
     * Creates credentials that logs in using the [Anonymous Provider](https://docs.mongodb.com/realm/authentication/anonymous/).
     *
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static anonymous() {
        return new Credentials("anon-user", "anon-user", {});
    }
    /**
     * Creates credentials that logs in using the [API Key Provider](https://docs.mongodb.com/realm/authentication/api-key/).
     *
     * @param key The secret content of the API key.
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static apiKey(key) {
        return new Credentials("api-key", "api-key", { key });
    }
    /**
     * Creates credentials that logs in using the [Email/Password Provider](https://docs.mongodb.com/realm/authentication/email-password/).
     * Note: This was formerly known as the "Username/Password" provider.
     *
     * @param email The end-users email address.
     * @param password The end-users password.
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static emailPassword(email, password) {
        return new Credentials("local-userpass", "local-userpass", {
            username: email,
            password,
        });
    }
    /**
     * Creates credentials that logs in using the [Custom Function Provider](https://docs.mongodb.com/realm/authentication/custom-function/).
     *
     * @param payload The custom payload as expected by the server.
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static function(payload) {
        return new Credentials("custom-function", "custom-function", payload);
    }
    /**
     * Creates credentials that logs in using the [Custom JWT Provider](https://docs.mongodb.com/realm/authentication/custom-jwt/).
     *
     * @param token The JSON Web Token (JWT).
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static jwt(token) {
        return new Credentials("custom-token", "custom-token", {
            token,
        });
    }
    /**
     * Creates credentials that logs in using the [Google Provider](https://docs.mongodb.com/realm/authentication/google/).
     *
     * @param payload The URL that users should be redirected to, the auth code or id token from Google.
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static google(payload) {
        return new Credentials("oauth2-google", "oauth2-google", Credentials.derivePayload(payload));
    }
    /**
     * @param payload The payload string.
     * @returns A payload object based on the string.
     */
    static derivePayload(payload) {
        if (typeof payload === "string") {
            throw new Error("`google(<tokenString>)` has been deprecated.  Please use `google(<authCodeObject>).");
        }
        else if (Object.keys(payload).length === 1) {
            if ("authCode" in payload || "redirectUrl" in payload) {
                return payload;
            }
            else if ("idToken" in payload) {
                return { id_token: payload.idToken };
            }
            else {
                throw new Error("Unexpected payload: " + JSON.stringify(payload));
            }
        }
        else {
            throw new Error("Expected only one property in payload, got " + JSON.stringify(payload));
        }
    }
    /**
     * Creates credentials that logs in using the [Facebook Provider](https://docs.mongodb.com/realm/authentication/facebook/).
     *
     * @param redirectUrlOrAccessToken The URL that users should be redirected to or the auth code returned from Facebook.
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static facebook(redirectUrlOrAccessToken) {
        return new Credentials("oauth2-facebook", "oauth2-facebook", redirectUrlOrAccessToken.includes("://")
            ? { redirectUrl: redirectUrlOrAccessToken }
            : { accessToken: redirectUrlOrAccessToken });
    }
    /**
     * Creates credentials that logs in using the [Apple ID Provider](https://docs.mongodb.com/realm/authentication/apple/).
     *
     * @param redirectUrlOrIdToken The URL that users should be redirected to or the id_token returned from Apple.
     * @returns The credentials instance, which can be passed to `app.logIn`.
     */
    static apple(redirectUrlOrIdToken) {
        return new Credentials("oauth2-apple", "oauth2-apple", redirectUrlOrIdToken.includes("://") ? { redirectUrl: redirectUrlOrIdToken } : { id_token: redirectUrlOrIdToken });
    }
}

////////////////////////////////////////////////////////////////////////////
const USER_IDS_STORAGE_KEY = "userIds";
const DEVICE_ID_STORAGE_KEY = "deviceId";
/**
 * Storage specific to the app.
 */
class AppStorage extends PrefixedStorage {
    /**
     * @param storage The underlying storage to wrap.
     * @param appId The id of the app.
     */
    constructor(storage, appId) {
        super(storage, `app(${appId})`);
    }
    /**
     * Reads out the list of user ids from storage.
     *
     * @returns A list of user ids.
     */
    getUserIds() {
        const userIdsString = this.get(USER_IDS_STORAGE_KEY);
        const userIds = userIdsString ? JSON.parse(userIdsString) : [];
        if (Array.isArray(userIds)) {
            // Remove any duplicates that might have been added
            // The Set preserves insertion order
            return [...new Set(userIds)];
        }
        else {
            throw new Error("Expected the user ids to be an array");
        }
    }
    /**
     * Sets the list of ids in storage.
     * Optionally merging with existing ids stored in the storage, by prepending these while voiding duplicates.
     *
     * @param userIds The list of ids to store.
     * @param mergeWithExisting Prepend existing ids to avoid data-races with other apps using this storage.
     */
    setUserIds(userIds, mergeWithExisting) {
        if (mergeWithExisting) {
            // Add any existing user id to the end of this list, avoiding duplicates
            const existingIds = this.getUserIds();
            for (const id of existingIds) {
                if (userIds.indexOf(id) === -1) {
                    userIds.push(id);
                }
            }
        }
        // Store the list of ids
        this.set(USER_IDS_STORAGE_KEY, JSON.stringify(userIds));
    }
    /**
     * Remove an id from the list of ids.
     *
     * @param userId The id of a User to be removed.
     */
    removeUserId(userId) {
        const existingIds = this.getUserIds();
        const userIds = existingIds.filter((id) => id !== userId);
        // Store the list of ids
        this.setUserIds(userIds, false);
    }
    /**
     * @returns id of this device (if any exists)
     */
    getDeviceId() {
        return this.get(DEVICE_ID_STORAGE_KEY);
    }
    /**
     * @param deviceId The id of this device, to send on subsequent authentication requests.
     */
    setDeviceId(deviceId) {
        this.set(DEVICE_ID_STORAGE_KEY, deviceId);
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const CLOSE_CHECK_INTERVAL = 100; // 10 times per second
const REDIRECT_HASH_TO_RESULT = {
    _stitch_client_app_id: "appId",
    _baas_client_app_id: "appId",
    _stitch_ua: "userAuth",
    _baas_ua: "userAuth",
    _stitch_link: "link",
    _baas_link: "link",
    _stitch_error: "error",
    _baas_error: "error",
    _stitch_state: "state",
    _baas_state: "state",
};
/**
 * A collection of methods helping implement the OAuth2 flow.
 */
class OAuth2Helper {
    /**
     * @param storage The underlying storage to use when storing and retriving secrets.
     * @param openWindow An optional function called when a browser window needs to open.
     */
    constructor(storage, openWindow = getEnvironment().openWindow) {
        this.storage = storage.prefix("oauth2");
        this.openWindow = openWindow;
    }
    /**
     * Parses the query string from the final step of the OAuth flow.
     *
     * @param queryString The query string passed through in location.hash.
     * @returns The result of the OAuth flow.
     */
    static parseRedirectLocation(queryString) {
        const params = decodeQueryString(queryString);
        const result = {};
        for (const [p, r] of Object.entries(REDIRECT_HASH_TO_RESULT)) {
            const value = params[p];
            if (value) {
                result[r] = value;
            }
        }
        return result;
    }
    /**
     * Handle the redirect querystring by parsing it and storing it for others to consume.
     *
     * @param queryString The query string containing the encoded result from the OAuth provider.
     * @param storage The underlying storage used to persist the result.
     */
    static handleRedirect(queryString, storage = getEnvironment().defaultStorage) {
        const result = OAuth2Helper.parseRedirectLocation(queryString);
        const { state, error } = result;
        if (typeof state === "string") {
            const oauth2Storage = storage.prefix("oauth2");
            const stateStorage = OAuth2Helper.getStateStorage(oauth2Storage, state);
            stateStorage.set("result", JSON.stringify(result));
        }
        else if (error) {
            throw new Error(`Failed to handle OAuth 2.0 redirect: ${error}`);
        }
        else {
            throw new Error("Failed to handle OAuth 2.0 redirect.");
        }
    }
    /**
     * Decodes the authInfo string into its seperate parts.
     *
     * @param authInfo An authInfo string returned from the server.
     * @returns An object containing the separate parts of the authInfo string.
     */
    static decodeAuthInfo(authInfo) {
        const parts = (authInfo || "").split("$");
        if (parts.length === 4) {
            const [accessToken, refreshToken, userId, deviceId] = parts;
            return { accessToken, refreshToken, userId, deviceId };
        }
        else {
            throw new Error("Failed to decode 'authInfo' into ids and tokens");
        }
    }
    /**
     * Get the storage key associated of an secret associated with a state.
     *
     * @param storage The root storage used to derive a "state namespaced" storage.
     * @param state The random state.
     * @returns The storage associated with a particular state.
     */
    static getStateStorage(storage, state) {
        return storage.prefix(`state(${state})`);
    }
    /**
     * Open a window and wait for the redirect to be handled.
     *
     * @param url The URL to open.
     * @param state The state which will be used to listen for storage updates.
     * @returns The result passed through the redirect.
     */
    openWindowAndWaitForRedirect(url, state) {
        const stateStorage = OAuth2Helper.getStateStorage(this.storage, state);
        // Return a promise that resolves when the  gets known
        return new Promise((resolve, reject) => {
            let redirectWindow = null;
            // We're declaring the interval now to enable referencing before its initialized
            let windowClosedInterval; // eslint-disable-line prefer-const
            const handleStorageUpdate = () => {
                // Trying to get the secret from storage
                const result = stateStorage.get("result");
                if (result) {
                    const parsedResult = JSON.parse(result);
                    // The secret got updated!
                    stateStorage.removeListener(handleStorageUpdate);
                    // Clear the storage to prevent others from reading this
                    stateStorage.clear();
                    // Try closing the newly created window
                    try {
                        if (redirectWindow) {
                            // Stop checking if the window closed
                            clearInterval(windowClosedInterval);
                            redirectWindow.close();
                        }
                    }
                    catch (err) {
                        console.warn(`Failed closing redirect window: ${err}`);
                    }
                    finally {
                        resolve(parsedResult);
                    }
                }
            };
            // Add a listener to the state storage, awaiting an update to the secret
            stateStorage.addListener(handleStorageUpdate);
            // Open up a window
            redirectWindow = this.openWindow(url);
            // Not using a const, because we need the two listeners to reference each other when removing the other.
            windowClosedInterval = setInterval(() => {
                // Polling "closed" because registering listeners on the window violates cross-origin policies
                if (!redirectWindow) {
                    // No need to keep polling for a window that we can't check
                    clearInterval(windowClosedInterval);
                }
                else if (redirectWindow.closed) {
                    // Stop polling the window state
                    clearInterval(windowClosedInterval);
                    // Stop listening for changes to the storage
                    stateStorage.removeListener(handleStorageUpdate);
                    // Reject the promise
                    const err = new Error("Window closed");
                    reject(err);
                }
            }, CLOSE_CHECK_INTERVAL);
        });
    }
    /**
     * Generate a random state string.
     *
     * @returns The random state string.
     */
    generateState() {
        return generateRandomString(12, LOWERCASE_LETTERS);
    }
}

////////////////////////////////////////////////////////////////////////////
const REDIRECT_LOCATION_HEADER = "x-baas-location";
/**
 * Handles authentication and linking of users.
 */
class Authenticator {
    /**
     * @param fetcher The fetcher used to fetch responses from the server.
     * @param storage The storage used when completing OAuth 2.0 flows (should not be scoped to a specific app).
     * @param getDeviceInformation Called to get device information to be sent to the server.
     */
    constructor(fetcher, storage, getDeviceInformation) {
        this.fetcher = fetcher;
        this.oauth2 = new OAuth2Helper(storage);
        this.getDeviceInformation = getDeviceInformation;
    }
    /**
     * @param credentials Credentials to use when logging in.
     * @param linkingUser A user requesting to link.
     * @returns A promise resolving to the response from the server.
     */
    async authenticate(credentials, linkingUser) {
        const deviceInformation = this.getDeviceInformation();
        const isLinking = typeof linkingUser === "object";
        if (credentials.providerType.startsWith("oauth2") && typeof credentials.payload.redirectUrl === "string") {
            // Initiate the OAuth2 flow by generating a state and fetch a redirect URL
            const state = this.oauth2.generateState();
            const url = await this.getLogInUrl(credentials, isLinking, {
                state,
                redirect: credentials.payload.redirectUrl,
                // Ensure redirects are communicated in a header different from "Location" and status remains 200 OK
                providerRedirectHeader: isLinking ? true : undefined,
                // Add the device information, only if we're not linking - since that request won't have a body of its own.
                device: !isLinking ? deviceInformation.encode() : undefined,
            });
            // If we're linking, we need to send the users access token in the request
            if (isLinking) {
                const response = await this.fetcher.fetch({
                    method: "GET",
                    url,
                    tokenType: isLinking ? "access" : "none",
                    user: linkingUser,
                    // The response will set a cookie that we need to tell the browser to store
                    mode: "cors",
                    credentials: "include",
                });
                // If a response header contains a redirect URL: Open a window and wait for the redirect to be handled
                const redirectUrl = response.headers.get(REDIRECT_LOCATION_HEADER);
                if (redirectUrl) {
                    return this.openWindowAndWaitForAuthResponse(redirectUrl, state);
                }
                else {
                    throw new Error(`Missing ${REDIRECT_LOCATION_HEADER} header`);
                }
            }
            else {
                // Otherwise we can open a window and let the server redirect the user right away
                // This gives lower latency (as we don't need the client to receive and execute the redirect in code)
                // This also has less dependency on cookies and doesn't sent any tokens.
                return this.openWindowAndWaitForAuthResponse(url, state);
            }
        }
        else {
            const logInUrl = await this.getLogInUrl(credentials, isLinking);
            const response = await this.fetcher.fetchJSON({
                method: "POST",
                url: logInUrl,
                body: {
                    ...credentials.payload,
                    options: {
                        device: deviceInformation.toJSON(),
                    },
                },
                tokenType: isLinking ? "access" : "none",
                user: linkingUser,
            });
            // Spread out values from the response and ensure they're valid
            const { user_id: userId, access_token: accessToken, refresh_token: refreshToken = null, device_id: deviceId, } = response;
            if (typeof userId !== "string") {
                throw new Error("Expected a user id in the response");
            }
            if (typeof accessToken !== "string") {
                throw new Error("Expected an access token in the response");
            }
            if (typeof refreshToken !== "string" && refreshToken !== null) {
                throw new Error("Expected refresh token to be a string or null");
            }
            if (typeof deviceId !== "string") {
                throw new Error("Expected device id to be a string");
            }
            return { userId, accessToken, refreshToken, deviceId };
        }
    }
    /**
     * @param credentials Credentials to use when logging in.
     * @param link Should the request link with the current user?
     * @param extraQueryParams Any extra parameters to include in the query string
     * @returns A promise resolving to the url to be used when logging in.
     */
    async getLogInUrl(credentials, link = false, extraQueryParams = {}) {
        // See https://github.com/mongodb/stitch-js-sdk/blob/310f0bd5af80f818cdfbc3caf1ae29ffa8e9c7cf/packages/core/sdk/src/auth/internal/CoreStitchAuth.ts#L746-L780
        const appRoute = this.fetcher.appRoute;
        const loginRoute = appRoute.authProvider(credentials.providerName).login();
        const qs = encodeQueryString({
            link: link ? "true" : undefined,
            ...extraQueryParams,
        });
        const locationUrl = await this.fetcher.locationUrl;
        return locationUrl + loginRoute.path + qs;
    }
    async openWindowAndWaitForAuthResponse(redirectUrl, state) {
        const redirectResult = await this.oauth2.openWindowAndWaitForRedirect(redirectUrl, state);
        // Decode the auth info (id, tokens, etc.) from the result of the redirect
        return OAuth2Helper.decodeAuthInfo(redirectResult.userAuth);
    }
}

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
// TODO: Determine if the shape of an error response is specific to each service or widely used.
/**
 * An error produced while communicating with the MongoDB Realm server.
 */
class MongoDBRealmError extends Error {
    constructor(method, url, statusCode, statusText, error, errorCode, link) {
        const summary = statusText ? `status ${statusCode} ${statusText}` : `status ${statusCode}`;
        if (typeof error === "string") {
            super(`Request failed (${method} ${url}): ${error} (${summary})`);
        }
        else {
            super(`Request failed (${method} ${url}): (${summary})`);
        }
        this.method = method;
        this.url = url;
        this.statusText = statusText;
        this.statusCode = statusCode;
        this.error = error;
        this.errorCode = errorCode;
        this.link = link;
    }
    /**
     * Constructs and returns an error from a request and a response.
     * Note: The caller must throw this error themselves.
     *
     * @param request The request sent to the server.
     * @param response A raw response, as returned from the server.
     * @returns An error from a request and a response.
     */
    static async fromRequestAndResponse(request, response) {
        var _a;
        const { url, method } = request;
        const { status, statusText } = response;
        if ((_a = response.headers.get("content-type")) === null || _a === void 0 ? void 0 : _a.startsWith("application/json")) {
            const body = await response.json();
            if (typeof body === "object" && body) {
                const { error, error_code: errorCode, link } = body;
                return new MongoDBRealmError(method, url, status, statusText, typeof error === "string" ? error : undefined, typeof errorCode === "string" ? errorCode : undefined, typeof link === "string" ? link : undefined);
            }
        }
        return new MongoDBRealmError(method, url, status, statusText);
    }
}

////////////////////////////////////////////////////////////////////////////
/**
 * @param body A possible resonse body.
 * @returns An async iterator.
 */
function asyncIteratorFromResponseBody(body) {
    if (typeof body !== "object" || body === null) {
        throw new Error("Expected a non-null object");
    }
    else if (Symbol.asyncIterator in body) {
        return body;
    }
    else if ("getReader" in body) {
        const stream = body;
        return {
            [Symbol.asyncIterator]() {
                const reader = stream.getReader();
                return {
                    next() {
                        return reader.read();
                    },
                    async return() {
                        await reader.cancel();
                        return { done: true, value: null };
                    },
                };
            },
        };
    }
    else {
        throw new Error("Expected an AsyncIterable or a ReadableStream");
    }
}
/**
 * Wraps a NetworkTransport from the "@realm/network-transport" package.
 * Extracts error messages and throws `MongoDBRealmError` objects upon failures.
 * Injects access or refresh tokens for a current or specific user.
 * Refreshes access tokens if requests fails due to a 401 error.
 * Optionally parses response as JSON before returning it.
 * Fetches and exposes an app's location url.
 */
class Fetcher {
    /**
     * @param config A configuration of the fetcher.
     * @param config.appId The application id.
     * @param config.transport The transport used when fetching.
     * @param config.userContext An object used to determine the requesting user.
     * @param config.locationUrlContext An object used to determine the location / base URL.
     */
    constructor({ appId, transport, userContext, locationUrlContext }) {
        this.appId = appId;
        this.transport = transport;
        this.userContext = userContext;
        this.locationUrlContext = locationUrlContext;
    }
    /**
     * @param user An optional user to generate the header for.
     * @param tokenType The type of token (access or refresh).
     * @returns An object containing the user's token as "Authorization" header or undefined if no user is given.
     */
    static buildAuthorizationHeader(user, tokenType) {
        if (!user || tokenType === "none") {
            return {};
        }
        else if (tokenType === "access") {
            return { Authorization: `Bearer ${user.accessToken}` };
        }
        else if (tokenType === "refresh") {
            return { Authorization: `Bearer ${user.refreshToken}` };
        }
        else {
            throw new Error(`Unexpected token type (${tokenType})`);
        }
    }
    /**
     * @param body The body string or object passed from a request.
     * @returns An object optionally specifying the "Content-Type" header.
     */
    static buildBody(body) {
        if (!body) {
            return;
        }
        else if (typeof body === "object" && body !== null) {
            return JSON.stringify(serialize(body));
        }
        else if (typeof body === "string") {
            return body;
        }
        else {
            console.log("body is", body);
            throw new Error("Unexpected type of body");
        }
    }
    /**
     * @param body The body string or object passed from a request.
     * @returns An object optionally specifying the "Content-Type" header.
     */
    static buildJsonHeader(body) {
        if (body && body.length > 0) {
            return { "Content-Type": "application/json" };
        }
        else {
            return {};
        }
    }
    clone(config) {
        return new Fetcher({
            appId: this.appId,
            transport: this.transport,
            userContext: this.userContext,
            locationUrlContext: this.locationUrlContext,
            ...config,
        });
    }
    /**
     * Fetch a network resource as an authenticated user.
     *
     * @param request The request which should be sent to the server.
     * @returns The response from the server.
     */
    async fetch(request) {
        const { path, url, tokenType = "access", user = this.userContext.currentUser, ...restOfRequest } = request;
        if (typeof path === "string" && typeof url === "string") {
            throw new Error("Use of 'url' and 'path' mutually exclusive");
        }
        else if (typeof path === "string") {
            // Derive the URL
            const url = (await this.locationUrlContext.locationUrl) + path;
            return this.fetch({ ...request, path: undefined, url });
        }
        else if (typeof url === "string") {
            const response = await this.transport.fetch({
                ...restOfRequest,
                url,
                headers: {
                    ...Fetcher.buildAuthorizationHeader(user, tokenType),
                    ...request.headers,
                },
            });
            if (response.ok) {
                return response;
            }
            else if (user && response.status === 401 && tokenType === "access") {
                // If the access token has expired, it would help refreshing it
                await user.refreshAccessToken();
                // Retry with the specific user, since the currentUser might have changed.
                return this.fetch({ ...request, user });
            }
            else {
                if (user && response.status === 401 && tokenType === "refresh") {
                    // A 401 error while using the refresh token indicates the token has an issue.
                    // Reset the tokens to prevent a lock.
                    user.accessToken = null;
                    user.refreshToken = null;
                }
                // Throw an error with a message extracted from the body
                throw await MongoDBRealmError.fromRequestAndResponse(request, response);
            }
        }
        else {
            throw new Error("Expected either 'url' or 'path'");
        }
    }
    /**
     * Fetch a network resource as an authenticated user and parse the result as extended JSON.
     *
     * @param request The request which should be sent to the server.
     * @returns The response from the server, parsed as extended JSON.
     */
    async fetchJSON(request) {
        const { body } = request;
        const serializedBody = Fetcher.buildBody(body);
        const contentTypeHeaders = Fetcher.buildJsonHeader(serializedBody);
        const response = await this.fetch({
            ...request,
            body: serializedBody,
            headers: {
                Accept: "application/json",
                ...contentTypeHeaders,
                ...request.headers,
            },
        });
        const contentType = response.headers.get("content-type");
        if (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("application/json")) {
            const responseBody = await response.json();
            return deserialize(responseBody);
        }
        else if (contentType === null) {
            return null;
        }
        else {
            throw new Error(`Expected JSON response, got "${contentType}"`);
        }
    }
    /**
     * Fetch an "event-stream" resource as an authenticated user.
     *
     * @param request The request which should be sent to the server.
     * @returns An async iterator over the response body.
     */
    async fetchStream(request) {
        const { body } = await this.fetch({
            ...request,
            headers: {
                Accept: "text/event-stream",
                ...request.headers,
            },
        });
        return asyncIteratorFromResponseBody(body);
    }
    /**
     * @returns The path of the app route.
     */
    get appRoute() {
        return routes.api().app(this.appId);
    }
    /**
     * @returns A promise of the location URL of the app.
     */
    get locationUrl() {
        return this.locationUrlContext.locationUrl;
    }
}

////////////////////////////////////////////////////////////////////////////
/**
 * The key in a storage on which the device id is stored.
 */
const DEVICE_ID_STORAGE_KEY$1 = "deviceId";
var DeviceFields;
(function (DeviceFields) {
    DeviceFields["DEVICE_ID"] = "deviceId";
    DeviceFields["APP_ID"] = "appId";
    DeviceFields["APP_VERSION"] = "appVersion";
    DeviceFields["PLATFORM"] = "platform";
    DeviceFields["PLATFORM_VERSION"] = "platformVersion";
    DeviceFields["SDK_VERSION"] = "sdkVersion";
})(DeviceFields || (DeviceFields = {}));
/**
 * Information describing the device, app and SDK.
 */
class DeviceInformation {
    /**
     * @param params Construct the device information from these parameters.
     * @param params.appId A user-defined application id.
     * @param params.appVersion A user-defined application version.
     * @param params.deviceId An unique id for the end-users device.
     */
    constructor({ appId, appVersion, deviceId }) {
        /**
         * The version of the Realm Web SDK (constant provided by Rollup).
         */
        this.sdkVersion = "2.0.0";
        const environment = getEnvironment();
        this.platform = environment.platform;
        this.platformVersion = environment.platformVersion;
        this.appId = appId;
        this.appVersion = appVersion;
        this.deviceId = deviceId;
    }
    /**
     * @returns An base64 URI encoded representation of the device information.
     */
    encode() {
        const obj = removeKeysWithUndefinedValues(this);
        return gBase64.encode(JSON.stringify(obj));
    }
    /**
     * @returns The defaults
     */
    toJSON() {
        return removeKeysWithUndefinedValues(this);
    }
}

////////////////////////////////////////////////////////////////////////////
/**
 * Default base url to prefix all requests if no baseUrl is specified in the configuration.
 */
const DEFAULT_BASE_URL = "https://realm.mongodb.com";
/**
 * Atlas App Services Application
 */
class App {
    /**
     * Construct a Realm App, either from the Realm App id visible from the Atlas App Services UI or a configuration.
     *
     * @param idOrConfiguration The Realm App id or a configuration to use for this app.
     */
    constructor(idOrConfiguration) {
        /**
         * An array of active and logged-out users.
         * Elements in the beginning of the array is considered more recent than the later elements.
         */
        this.users = [];
        /**
         * A promise resolving to the App's location url.
         */
        this._locationUrl = null;
        // If the argument is a string, convert it to a simple configuration object.
        const configuration = typeof idOrConfiguration === "string" ? { id: idOrConfiguration } : idOrConfiguration;
        // Initialize properties from the configuration
        if (typeof configuration === "object" && typeof configuration.id === "string") {
            this.id = configuration.id;
        }
        else {
            throw new Error("Missing an Atlas App Services app-id");
        }
        this.baseUrl = configuration.baseUrl || DEFAULT_BASE_URL;
        if (configuration.skipLocationRequest) {
            // Use the base url directly, instead of requesting a location URL from the server
            this._locationUrl = Promise.resolve(this.baseUrl);
        }
        this.localApp = configuration.app;
        const { storage, transport = new DefaultNetworkTransport() } = configuration;
        // Construct a fetcher wrapping the network transport
        this.fetcher = new Fetcher({
            appId: this.id,
            userContext: this,
            locationUrlContext: this,
            transport,
        });
        // Construct the auth providers
        this.emailPasswordAuth = new EmailPasswordAuth(this.fetcher);
        // Construct the storage
        const baseStorage = storage || getEnvironment().defaultStorage;
        this.storage = new AppStorage(baseStorage, this.id);
        this.authenticator = new Authenticator(this.fetcher, baseStorage, () => this.deviceInformation);
        // Hydrate the app state from storage
        try {
            this.hydrate();
        }
        catch (err) {
            // The storage was corrupted
            this.storage.clear();
            // A failed hydration shouldn't throw and break the app experience
            // Since this is "just" persisted state that unfortunately got corrupted or partially lost
            console.warn("Realm app hydration failed:", err instanceof Error ? err.message : err);
        }
    }
    /**
     * Get or create a singleton Realm App from an id.
     * Calling this function multiple times with the same id will return the same instance.
     *
     * @param id The Realm App id visible from the Atlas App Services UI or a configuration.
     * @returns The Realm App instance.
     */
    static getApp(id) {
        if (id in App.appCache) {
            return App.appCache[id];
        }
        else {
            const instance = new App(id);
            App.appCache[id] = instance;
            return instance;
        }
    }
    /**
     * Switch user.
     *
     * @param nextUser The user or id of the user to switch to.
     */
    switchUser(nextUser) {
        const index = this.users.findIndex((u) => u === nextUser);
        if (index === -1) {
            throw new Error("The user was never logged into this app");
        }
        // Remove the user from the stack
        const [user] = this.users.splice(index, 1);
        // Insert the user in the beginning of the stack
        this.users.unshift(user);
    }
    /**
     * Log in a user.
     *
     * @param credentials Credentials to use when logging in.
     * @param fetchProfile Should the users profile be fetched? (default: true)
     * @returns A promise resolving to the newly logged in user.
     */
    async logIn(credentials, fetchProfile = true) {
        const response = await this.authenticator.authenticate(credentials);
        const user = this.createOrUpdateUser(response, credentials.providerType);
        // Let's ensure this will be the current user, in case the user object was reused.
        this.switchUser(user);
        // If needed, fetch and set the profile on the user
        if (fetchProfile) {
            await user.refreshProfile();
        }
        // Persist the user id in the storage,
        // merging to avoid overriding logins from other apps using the same underlying storage
        this.storage.setUserIds(this.users.map((u) => u.id), true);
        // Read out and store the device id from the server
        const deviceId = response.deviceId;
        if (deviceId && deviceId !== "000000000000000000000000") {
            this.storage.set(DEVICE_ID_STORAGE_KEY$1, deviceId);
        }
        // Return the user
        return user;
    }
    /**
     * @inheritdoc
     */
    async removeUser(user) {
        // Remove the user from the list of users
        const index = this.users.findIndex((u) => u === user);
        if (index === -1) {
            throw new Error("The user was never logged into this app");
        }
        this.users.splice(index, 1);
        // Log out the user - this removes access and refresh tokens from storage
        await user.logOut();
        // Remove the users profile from storage
        this.storage.remove(`user(${user.id}):profile`);
        // Remove the user from the storage
        this.storage.removeUserId(user.id);
    }
    /**
     * @inheritdoc
     */
    async deleteUser(user) {
        await this.fetcher.fetchJSON({
            method: "DELETE",
            path: routes.api().auth().delete().path,
        });
        await this.removeUser(user);
    }
    /**
     * @inheritdoc
     */
    addListener() {
        throw new Error("Not yet implemented");
    }
    /**
     * @inheritdoc
     */
    removeListener() {
        throw new Error("Not yet implemented");
    }
    /**
     * @inheritdoc
     */
    removeAllListeners() {
        throw new Error("Not yet implemented");
    }
    /**
     * The currently active user (or null if no active users exists).
     *
     * @returns the currently active user or null.
     */
    get currentUser() {
        const activeUsers = this.users.filter((user) => user.state === exports.UserState.Active);
        if (activeUsers.length === 0) {
            return null;
        }
        else {
            // Current user is the top of the stack
            return activeUsers[0];
        }
    }
    /**
     * All active and logged-out users:
     *  - First in the list are active users (ordered by most recent call to switchUser or login)
     *  - Followed by logged out users (also ordered by most recent call to switchUser or login).
     *
     * @returns An array of users active or logged out users (current user being the first).
     */
    get allUsers() {
        // Returning a freezed copy of the list of users to prevent outside changes
        return Object.fromEntries(this.users.map((user) => [user.id, user]));
    }
    /**
     * @returns A promise of the app URL, with the app location resolved.
     */
    get locationUrl() {
        if (!this._locationUrl) {
            const path = routes.api().app(this.id).location().path;
            this._locationUrl = this.fetcher
                .fetchJSON({
                method: "GET",
                url: this.baseUrl + path,
                tokenType: "none",
            })
                .then((body) => {
                if (typeof body !== "object") {
                    throw new Error("Expected response body be an object");
                }
                else {
                    return body;
                }
            })
                .then(({ hostname }) => {
                if (typeof hostname !== "string") {
                    throw new Error("Expected response to contain a 'hostname'");
                }
                else {
                    return hostname;
                }
            })
                .catch((err) => {
                // Reset the location to allow another request to fetch again.
                this._locationUrl = null;
                throw err;
            });
        }
        return this._locationUrl;
    }
    /**
     * @returns Information about the current device, sent to the server when authenticating.
     */
    get deviceInformation() {
        const deviceIdStr = this.storage.getDeviceId();
        const deviceId = typeof deviceIdStr === "string" && deviceIdStr !== "000000000000000000000000"
            ? new bson.ObjectId(deviceIdStr)
            : undefined;
        return new DeviceInformation({
            appId: this.localApp ? this.localApp.name : undefined,
            appVersion: this.localApp ? this.localApp.version : undefined,
            deviceId,
        });
    }
    /**
     * Create (and store) a new user or update an existing user's access and refresh tokens.
     * This helps de-duplicating users in the list of users known to the app.
     *
     * @param response A response from the Authenticator.
     * @param providerType The type of the authentication provider used.
     * @returns A new or an existing user.
     */
    createOrUpdateUser(response, providerType) {
        const existingUser = this.users.find((u) => u.id === response.userId);
        if (existingUser) {
            // Update the users access and refresh tokens
            existingUser.accessToken = response.accessToken;
            existingUser.refreshToken = response.refreshToken;
            return existingUser;
        }
        else {
            // Create and store a new user
            if (!response.refreshToken) {
                throw new Error("No refresh token in response from server");
            }
            const user = new User({
                app: this,
                id: response.userId,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                providerType,
            });
            this.users.unshift(user);
            return user;
        }
    }
    /**
     * Restores the state of the app (active and logged-out users) from the storage
     */
    hydrate() {
        const userIds = this.storage.getUserIds();
        this.users = userIds.map((id) => new User({ app: this, id }));
    }
}
/**
 * A map of app instances returned from calling getApp.
 */
App.appCache = {};
/**
 * Instances of this class can be passed to the `app.logIn` method to authenticate an end-user.
 */
App.Credentials = Credentials;

////////////////////////////////////////////////////////////////////////////
/**
 * Get or create a singleton Realm App from an id.
 * Calling this function multiple times with the same id will return the same instance.
 *
 * @param id The Realm App id visible from the Atlas App Services UI or a configuration.
 * @returns The Realm App instance.
 */
function getApp(id) {
    return App.getApp(id);
}

////////////////////////////////////////////////////////////////////////////
/**
 * Set the value of `isDevelopmentMode`. This allows each entry point (node vs DOM)
 * to use its own method for determining whether we are in development mode.
 *
 * @param state A boolean indicating whether the user's app is running in
 * development mode or not.
 */
const setIsDevelopmentMode$1 = (state) => {
};

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////
// Exports a globalThis which is polyfilled for iOS 11/12
// From https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/global.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const check$1 = function (it) {
    return it && it.Math == Math && it;
};
// eslint-disable-next-line no-restricted-globals
const safeGlobalThis$1 = 
// eslint-disable-next-line no-restricted-globals
check$1(typeof globalThis == "object" && globalThis) ||
    check$1(typeof window == "object" && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore allow `self`
    check$1(typeof self == "object" && self) ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore allow `global`
    check$1(typeof global == "object" && global) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore allow `this`
        return this;
    })() ||
    Function("return this")();

////////////////////////////////////////////////////////////////////////////
// React/React Native set a global __DEV__ variable when running in dev mode
setIsDevelopmentMode$1(typeof __DEV__ !== "undefined" && __DEV__);

////////////////////////////////////////////////////////////////////////////
/**
 * In-memory storage that will not be persisted.
 */
class LocalStorage {
    /**
     * Constructs a LocalStorage using the global window.
     */
    constructor() {
        if (typeof safeGlobalThis$1.localStorage === "object") {
            this.global = safeGlobalThis$1;
        }
        else {
            throw new Error("Cannot use LocalStorage without a global localStorage object");
        }
    }
    /** @inheritdoc */
    get(key) {
        return this.global.localStorage.getItem(key);
    }
    /** @inheritdoc */
    set(key, value) {
        return this.global.localStorage.setItem(key, value);
    }
    /** @inheritdoc */
    remove(key) {
        return this.global.localStorage.removeItem(key);
    }
    /** @inheritdoc */
    prefix(keyPart) {
        return new PrefixedStorage(this, keyPart);
    }
    /** @inheritdoc */
    clear(prefix) {
        const keys = [];
        // Iterate all keys to find the once have a matching prefix.
        for (let i = 0; i < this.global.localStorage.length; i++) {
            const key = this.global.localStorage.key(i);
            if (key && (!prefix || key.startsWith(prefix))) {
                keys.push(key);
            }
        }
        // Remove the items in a seperate loop to avoid updating while iterating.
        for (const key of keys) {
            this.global.localStorage.removeItem(key);
        }
    }
    /** @inheritdoc */
    addListener(listener) {
        return this.global.addEventListener("storage", listener);
    }
    /** @inheritdoc */
    removeListener(listener) {
        return this.global.removeEventListener("storage", listener);
    }
}

////////////////////////////////////////////////////////////////////////////
const browser = detect();
const DefaultStorage = "localStorage" in safeGlobalThis$1 ? LocalStorage : MemoryStorage;
/**
 * Attempt to use the browser to open a window
 *
 * @param url The url to open a window to.
 * @returns Then newly create window.
 */
function openWindow(url) {
    if (typeof safeGlobalThis$1.open === "function") {
        return safeGlobalThis$1.open(url);
    }
    else {
        console.log(`Please open ${url}`);
        return null;
    }
}
const environment$1 = {
    defaultStorage: new DefaultStorage().prefix("realm-web"),
    openWindow,
    platform: (browser === null || browser === void 0 ? void 0 : browser.name) || "web",
    platformVersion: (browser === null || browser === void 0 ? void 0 : browser.version) || "0.0.0",
    TextDecoder,
};
setEnvironment(environment$1);
/**
 * Handle an OAuth 2.0 redirect.
 *
 * @param location An optional location to use (defaults to the windows current location).
 * @param storage Optional storage used to save any results from the location.
 */
function handleAuthRedirect(location = safeGlobalThis$1.location, storage = environment$1.defaultStorage) {
    try {
        const queryString = location.hash.substr(1); // Strip the initial # from the hash
        OAuth2Helper.handleRedirect(queryString, storage);
    }
    catch (err) {
        // Ensure calling this never throws: It should not interrupt a users flow.
        console.warn(err);
    }
}

exports.BSON = bson__namespace;
exports.App = App;
exports.Credentials = Credentials;
exports.DEFAULT_BASE_URL = DEFAULT_BASE_URL;
exports.LocalStorage = LocalStorage;
exports.MongoDBRealmError = MongoDBRealmError;
exports.User = User;
exports.getApp = getApp;
exports.getEnvironment = getEnvironment;
exports.handleAuthRedirect = handleAuthRedirect;
exports.setEnvironment = setEnvironment;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"_process":39,"bson":12,"buffer":13}],41:[function(require,module,exports){
"use strict";
/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backoff = void 0;
function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 10000;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
}
exports.Backoff = Backoff;
/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */
Backoff.prototype.duration = function () {
    var ms = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
        var rand = Math.random();
        var deviation = Math.floor(rand * this.jitter * ms);
        ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
    }
    return Math.min(ms, this.max) | 0;
};
/**
 * Reset the number of attempts.
 *
 * @api public
 */
Backoff.prototype.reset = function () {
    this.attempts = 0;
};
/**
 * Set the minimum duration
 *
 * @api public
 */
Backoff.prototype.setMin = function (min) {
    this.ms = min;
};
/**
 * Set the maximum duration
 *
 * @api public
 */
Backoff.prototype.setMax = function (max) {
    this.max = max;
};
/**
 * Set the jitter
 *
 * @api public
 */
Backoff.prototype.setJitter = function (jitter) {
    this.jitter = jitter;
};

},{}],42:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.connect = exports.io = exports.Socket = exports.Manager = exports.protocol = void 0;
const url_js_1 = require("./url.js");
const manager_js_1 = require("./manager.js");
Object.defineProperty(exports, "Manager", { enumerable: true, get: function () { return manager_js_1.Manager; } });
const socket_js_1 = require("./socket.js");
Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_js_1.Socket; } });
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client"); // debug()
/**
 * Managers cache.
 */
const cache = {};
function lookup(uri, opts) {
    if (typeof uri === "object") {
        opts = uri;
        uri = undefined;
    }
    opts = opts || {};
    const parsed = url_js_1.url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew ||
        opts["force new connection"] ||
        false === opts.multiplex ||
        sameNamespace;
    let io;
    if (newConnection) {
        debug("ignoring socket cache for %s", source);
        io = new manager_js_1.Manager(source, opts);
    }
    else {
        if (!cache[id]) {
            debug("new io instance for %s", source);
            cache[id] = new manager_js_1.Manager(source, opts);
        }
        io = cache[id];
    }
    if (parsed.query && !opts.query) {
        opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
}
exports.io = lookup;
exports.connect = lookup;
exports.default = lookup;
// so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
// namespace (e.g. `io.connect(...)`), for backward compatibility
Object.assign(lookup, {
    Manager: manager_js_1.Manager,
    Socket: socket_js_1.Socket,
    io: lookup,
    connect: lookup,
});
/**
 * Protocol version.
 *
 * @public
 */
var socket_io_parser_1 = require("socket.io-parser");
Object.defineProperty(exports, "protocol", { enumerable: true, get: function () { return socket_io_parser_1.protocol; } });

module.exports = lookup;

},{"./manager.js":43,"./socket.js":45,"./url.js":46,"debug":15,"socket.io-parser":48}],43:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const engine_io_client_1 = require("engine.io-client");
const socket_js_1 = require("./socket.js");
const parser = __importStar(require("socket.io-parser"));
const on_js_1 = require("./on.js");
const backo2_js_1 = require("./contrib/backo2.js");
const component_emitter_1 = require("@socket.io/component-emitter");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client:manager"); // debug()
class Manager extends component_emitter_1.Emitter {
    constructor(uri, opts) {
        var _a;
        super();
        this.nsps = {};
        this.subs = [];
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        opts.path = opts.path || "/socket.io";
        this.opts = opts;
        engine_io_client_1.installTimerFunctions(this, opts);
        this.reconnection(opts.reconnection !== false);
        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
        this.reconnectionDelay(opts.reconnectionDelay || 1000);
        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
        this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
        this.backoff = new backo2_js_1.Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor(),
        });
        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
        this._readyState = "closed";
        this.uri = uri;
        const _parser = opts.parser || parser;
        this.encoder = new _parser.Encoder();
        this.decoder = new _parser.Decoder();
        this._autoConnect = opts.autoConnect !== false;
        if (this._autoConnect)
            this.open();
    }
    reconnection(v) {
        if (!arguments.length)
            return this._reconnection;
        this._reconnection = !!v;
        return this;
    }
    reconnectionAttempts(v) {
        if (v === undefined)
            return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
    }
    reconnectionDelay(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelay;
        this._reconnectionDelay = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
        return this;
    }
    randomizationFactor(v) {
        var _a;
        if (v === undefined)
            return this._randomizationFactor;
        this._randomizationFactor = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
        return this;
    }
    reconnectionDelayMax(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
        return this;
    }
    timeout(v) {
        if (!arguments.length)
            return this._timeout;
        this._timeout = v;
        return this;
    }
    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @private
     */
    maybeReconnectOnOpen() {
        // Only try to reconnect if it's the first time we're connecting
        if (!this._reconnecting &&
            this._reconnection &&
            this.backoff.attempts === 0) {
            // keeps reconnection from firing twice for the same reconnection loop
            this.reconnect();
        }
    }
    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} fn - optional, callback
     * @return self
     * @public
     */
    open(fn) {
        debug("readyState %s", this._readyState);
        if (~this._readyState.indexOf("open"))
            return this;
        debug("opening %s", this.uri);
        this.engine = new engine_io_client_1.Socket(this.uri, this.opts);
        const socket = this.engine;
        const self = this;
        this._readyState = "opening";
        this.skipReconnect = false;
        // emit `open`
        const openSubDestroy = on_js_1.on(socket, "open", function () {
            self.onopen();
            fn && fn();
        });
        // emit `error`
        const errorSub = on_js_1.on(socket, "error", (err) => {
            debug("error");
            self.cleanup();
            self._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
                fn(err);
            }
            else {
                // Only do this if there is no fn to handle the error
                self.maybeReconnectOnOpen();
            }
        });
        if (false !== this._timeout) {
            const timeout = this._timeout;
            debug("connect attempt will timeout after %d", timeout);
            if (timeout === 0) {
                openSubDestroy(); // prevents a race condition with the 'open' event
            }
            // set timer
            const timer = this.setTimeoutFn(() => {
                debug("connect attempt timed out after %d", timeout);
                openSubDestroy();
                socket.close();
                // @ts-ignore
                socket.emit("error", new Error("timeout"));
            }, timeout);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
        this.subs.push(openSubDestroy);
        this.subs.push(errorSub);
        return this;
    }
    /**
     * Alias for open()
     *
     * @return self
     * @public
     */
    connect(fn) {
        return this.open(fn);
    }
    /**
     * Called upon transport open.
     *
     * @private
     */
    onopen() {
        debug("open");
        // clear old subs
        this.cleanup();
        // mark as open
        this._readyState = "open";
        this.emitReserved("open");
        // add new subs
        const socket = this.engine;
        this.subs.push(on_js_1.on(socket, "ping", this.onping.bind(this)), on_js_1.on(socket, "data", this.ondata.bind(this)), on_js_1.on(socket, "error", this.onerror.bind(this)), on_js_1.on(socket, "close", this.onclose.bind(this)), on_js_1.on(this.decoder, "decoded", this.ondecoded.bind(this)));
    }
    /**
     * Called upon a ping.
     *
     * @private
     */
    onping() {
        this.emitReserved("ping");
    }
    /**
     * Called with data.
     *
     * @private
     */
    ondata(data) {
        try {
            this.decoder.add(data);
        }
        catch (e) {
            this.onclose("parse error", e);
        }
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        // the nextTick call prevents an exception in a user-provided event listener from triggering a disconnection due to a "parse error"
        engine_io_client_1.nextTick(() => {
            this.emitReserved("packet", packet);
        }, this.setTimeoutFn);
    }
    /**
     * Called upon socket error.
     *
     * @private
     */
    onerror(err) {
        debug("error", err);
        this.emitReserved("error", err);
    }
    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @public
     */
    socket(nsp, opts) {
        let socket = this.nsps[nsp];
        if (!socket) {
            socket = new socket_js_1.Socket(this, nsp, opts);
            this.nsps[nsp] = socket;
        }
        return socket;
    }
    /**
     * Called upon a socket close.
     *
     * @param socket
     * @private
     */
    _destroy(socket) {
        const nsps = Object.keys(this.nsps);
        for (const nsp of nsps) {
            const socket = this.nsps[nsp];
            if (socket.active) {
                debug("socket %s is still active, skipping close", nsp);
                return;
            }
        }
        this._close();
    }
    /**
     * Writes a packet.
     *
     * @param packet
     * @private
     */
    _packet(packet) {
        debug("writing packet %j", packet);
        const encodedPackets = this.encoder.encode(packet);
        for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
        }
    }
    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @private
     */
    cleanup() {
        debug("cleanup");
        this.subs.forEach((subDestroy) => subDestroy());
        this.subs.length = 0;
        this.decoder.destroy();
    }
    /**
     * Close the current socket.
     *
     * @private
     */
    _close() {
        debug("disconnect");
        this.skipReconnect = true;
        this._reconnecting = false;
        this.onclose("forced close");
        if (this.engine)
            this.engine.close();
    }
    /**
     * Alias for close()
     *
     * @private
     */
    disconnect() {
        return this._close();
    }
    /**
     * Called upon engine close.
     *
     * @private
     */
    onclose(reason, description) {
        debug("closed due to %s", reason);
        this.cleanup();
        this.backoff.reset();
        this._readyState = "closed";
        this.emitReserved("close", reason, description);
        if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
        }
    }
    /**
     * Attempt a reconnection.
     *
     * @private
     */
    reconnect() {
        if (this._reconnecting || this.skipReconnect)
            return this;
        const self = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) {
            debug("reconnect failed");
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
        }
        else {
            const delay = this.backoff.duration();
            debug("will wait %dms before reconnect attempt", delay);
            this._reconnecting = true;
            const timer = this.setTimeoutFn(() => {
                if (self.skipReconnect)
                    return;
                debug("attempting reconnect");
                this.emitReserved("reconnect_attempt", self.backoff.attempts);
                // check again for the case socket closed in above events
                if (self.skipReconnect)
                    return;
                self.open((err) => {
                    if (err) {
                        debug("reconnect attempt error");
                        self._reconnecting = false;
                        self.reconnect();
                        this.emitReserved("reconnect_error", err);
                    }
                    else {
                        debug("reconnect success");
                        self.onreconnect();
                    }
                });
            }, delay);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
    }
    /**
     * Called upon successful reconnect.
     *
     * @private
     */
    onreconnect() {
        const attempt = this.backoff.attempts;
        this._reconnecting = false;
        this.backoff.reset();
        this.emitReserved("reconnect", attempt);
    }
}
exports.Manager = Manager;

},{"./contrib/backo2.js":41,"./on.js":44,"./socket.js":45,"@socket.io/component-emitter":10,"debug":15,"engine.io-client":22,"socket.io-parser":48}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on = void 0;
function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
        obj.off(ev, fn);
    };
}
exports.on = on;

},{}],45:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const socket_io_parser_1 = require("socket.io-parser");
const on_js_1 = require("./on.js");
const component_emitter_1 = require("@socket.io/component-emitter");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client:socket"); // debug()
/**
 * Internal events.
 * These events can't be emitted by the user.
 */
const RESERVED_EVENTS = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
    newListener: 1,
    removeListener: 1,
});
/**
 * A Socket is the fundamental class for interacting with the server.
 *
 * A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
 *
 * @example
 * const socket = io();
 *
 * socket.on("connect", () => {
 *   console.log("connected");
 * });
 *
 * // send an event to the server
 * socket.emit("foo", "bar");
 *
 * socket.on("foobar", () => {
 *   // an event was received from the server
 * });
 *
 * // upon disconnection
 * socket.on("disconnect", (reason) => {
 *   console.log(`disconnected due to ${reason}`);
 * });
 */
class Socket extends component_emitter_1.Emitter {
    /**
     * `Socket` constructor.
     */
    constructor(io, nsp, opts) {
        super();
        /**
         * Whether the socket is currently connected to the server.
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.connected); // true
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.connected); // false
         * });
         */
        this.connected = false;
        /**
         * Buffer for packets received before the CONNECT packet
         */
        this.receiveBuffer = [];
        /**
         * Buffer for packets that will be sent once the socket is connected
         */
        this.sendBuffer = [];
        this.ids = 0;
        this.acks = {};
        this.flags = {};
        this.io = io;
        this.nsp = nsp;
        if (opts && opts.auth) {
            this.auth = opts.auth;
        }
        if (this.io._autoConnect)
            this.open();
    }
    /**
     * Whether the socket is currently disconnected
     *
     * @example
     * const socket = io();
     *
     * socket.on("connect", () => {
     *   console.log(socket.disconnected); // false
     * });
     *
     * socket.on("disconnect", () => {
     *   console.log(socket.disconnected); // true
     * });
     */
    get disconnected() {
        return !this.connected;
    }
    /**
     * Subscribe to open, close and packet events
     *
     * @private
     */
    subEvents() {
        if (this.subs)
            return;
        const io = this.io;
        this.subs = [
            on_js_1.on(io, "open", this.onopen.bind(this)),
            on_js_1.on(io, "packet", this.onpacket.bind(this)),
            on_js_1.on(io, "error", this.onerror.bind(this)),
            on_js_1.on(io, "close", this.onclose.bind(this)),
        ];
    }
    /**
     * Whether the Socket will try to reconnect when its Manager connects or reconnects.
     *
     * @example
     * const socket = io();
     *
     * console.log(socket.active); // true
     *
     * socket.on("disconnect", (reason) => {
     *   if (reason === "io server disconnect") {
     *     // the disconnection was initiated by the server, you need to manually reconnect
     *     console.log(socket.active); // false
     *   }
     *   // else the socket will automatically try to reconnect
     *   console.log(socket.active); // true
     * });
     */
    get active() {
        return !!this.subs;
    }
    /**
     * "Opens" the socket.
     *
     * @example
     * const socket = io({
     *   autoConnect: false
     * });
     *
     * socket.connect();
     */
    connect() {
        if (this.connected)
            return this;
        this.subEvents();
        if (!this.io["_reconnecting"])
            this.io.open(); // ensure open
        if ("open" === this.io._readyState)
            this.onopen();
        return this;
    }
    /**
     * Alias for {@link connect()}.
     */
    open() {
        return this.connect();
    }
    /**
     * Sends a `message` event.
     *
     * This method mimics the WebSocket.send() method.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     *
     * @example
     * socket.send("hello");
     *
     * // this is equivalent to
     * socket.emit("message", "hello");
     *
     * @return self
     */
    send(...args) {
        args.unshift("message");
        this.emit.apply(this, args);
        return this;
    }
    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @example
     * socket.emit("hello", "world");
     *
     * // all serializable datastructures are supported (no need to call JSON.stringify)
     * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
     *
     * // with an acknowledgement from the server
     * socket.emit("hello", "world", (val) => {
     *   // ...
     * });
     *
     * @return self
     */
    emit(ev, ...args) {
        if (RESERVED_EVENTS.hasOwnProperty(ev)) {
            throw new Error('"' + ev.toString() + '" is a reserved event name');
        }
        args.unshift(ev);
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: args,
        };
        packet.options = {};
        packet.options.compress = this.flags.compress !== false;
        // event ack callback
        if ("function" === typeof args[args.length - 1]) {
            const id = this.ids++;
            debug("emitting packet with ack id %d", id);
            const ack = args.pop();
            this._registerAckCallback(id, ack);
            packet.id = id;
        }
        const isTransportWritable = this.io.engine &&
            this.io.engine.transport &&
            this.io.engine.transport.writable;
        const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
        if (discardPacket) {
            debug("discard packet as the transport is not currently writable");
        }
        else if (this.connected) {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
        }
        else {
            this.sendBuffer.push(packet);
        }
        this.flags = {};
        return this;
    }
    /**
     * @private
     */
    _registerAckCallback(id, ack) {
        const timeout = this.flags.timeout;
        if (timeout === undefined) {
            this.acks[id] = ack;
            return;
        }
        // @ts-ignore
        const timer = this.io.setTimeoutFn(() => {
            delete this.acks[id];
            for (let i = 0; i < this.sendBuffer.length; i++) {
                if (this.sendBuffer[i].id === id) {
                    debug("removing packet with ack id %d from the buffer", id);
                    this.sendBuffer.splice(i, 1);
                }
            }
            debug("event with ack id %d has timed out after %d ms", id, timeout);
            ack.call(this, new Error("operation has timed out"));
        }, timeout);
        this.acks[id] = (...args) => {
            // @ts-ignore
            this.io.clearTimeoutFn(timer);
            ack.apply(this, [null, ...args]);
        };
    }
    /**
     * Sends a packet.
     *
     * @param packet
     * @private
     */
    packet(packet) {
        packet.nsp = this.nsp;
        this.io._packet(packet);
    }
    /**
     * Called upon engine `open`.
     *
     * @private
     */
    onopen() {
        debug("transport is open - connecting");
        if (typeof this.auth == "function") {
            this.auth((data) => {
                this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data });
            });
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data: this.auth });
        }
    }
    /**
     * Called upon engine or manager `error`.
     *
     * @param err
     * @private
     */
    onerror(err) {
        if (!this.connected) {
            this.emitReserved("connect_error", err);
        }
    }
    /**
     * Called upon engine `close`.
     *
     * @param reason
     * @param description
     * @private
     */
    onclose(reason, description) {
        debug("close (%s)", reason);
        this.connected = false;
        delete this.id;
        this.emitReserved("disconnect", reason, description);
    }
    /**
     * Called with socket packet.
     *
     * @param packet
     * @private
     */
    onpacket(packet) {
        const sameNamespace = packet.nsp === this.nsp;
        if (!sameNamespace)
            return;
        switch (packet.type) {
            case socket_io_parser_1.PacketType.CONNECT:
                if (packet.data && packet.data.sid) {
                    const id = packet.data.sid;
                    this.onconnect(id);
                }
                else {
                    this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                }
                break;
            case socket_io_parser_1.PacketType.EVENT:
            case socket_io_parser_1.PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.ACK:
            case socket_io_parser_1.PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.DISCONNECT:
                this.ondisconnect();
                break;
            case socket_io_parser_1.PacketType.CONNECT_ERROR:
                this.destroy();
                const err = new Error(packet.data.message);
                // @ts-ignore
                err.data = packet.data.data;
                this.emitReserved("connect_error", err);
                break;
        }
    }
    /**
     * Called upon a server event.
     *
     * @param packet
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        debug("emitting event %j", args);
        if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
        }
        if (this.connected) {
            this.emitEvent(args);
        }
        else {
            this.receiveBuffer.push(Object.freeze(args));
        }
    }
    emitEvent(args) {
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        super.emit.apply(this, args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function (...args) {
            // prevent double callbacks
            if (sent)
                return;
            sent = true;
            debug("sending ack %j", args);
            self.packet({
                type: socket_io_parser_1.PacketType.ACK,
                id: id,
                data: args,
            });
        };
    }
    /**
     * Called upon a server acknowlegement.
     *
     * @param packet
     * @private
     */
    onack(packet) {
        const ack = this.acks[packet.id];
        if ("function" === typeof ack) {
            debug("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            delete this.acks[packet.id];
        }
        else {
            debug("bad ack %s", packet.id);
        }
    }
    /**
     * Called upon server connect.
     *
     * @private
     */
    onconnect(id) {
        debug("socket connected with id %s", id);
        this.id = id;
        this.connected = true;
        this.emitBuffered();
        this.emitReserved("connect");
    }
    /**
     * Emit buffered events (received and emitted).
     *
     * @private
     */
    emitBuffered() {
        this.receiveBuffer.forEach((args) => this.emitEvent(args));
        this.receiveBuffer = [];
        this.sendBuffer.forEach((packet) => {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
        });
        this.sendBuffer = [];
    }
    /**
     * Called upon server disconnect.
     *
     * @private
     */
    ondisconnect() {
        debug("server disconnect (%s)", this.nsp);
        this.destroy();
        this.onclose("io server disconnect");
    }
    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @private
     */
    destroy() {
        if (this.subs) {
            // clean subscriptions to avoid reconnections
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = undefined;
        }
        this.io["_destroy"](this);
    }
    /**
     * Disconnects the socket manually. In that case, the socket will not try to reconnect.
     *
     * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
     *
     * @example
     * const socket = io();
     *
     * socket.on("disconnect", (reason) => {
     *   // console.log(reason); prints "io client disconnect"
     * });
     *
     * socket.disconnect();
     *
     * @return self
     */
    disconnect() {
        if (this.connected) {
            debug("performing disconnect (%s)", this.nsp);
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
        }
        // remove socket from pool
        this.destroy();
        if (this.connected) {
            // fire events
            this.onclose("io client disconnect");
        }
        return this;
    }
    /**
     * Alias for {@link disconnect()}.
     *
     * @return self
     */
    close() {
        return this.disconnect();
    }
    /**
     * Sets the compress flag.
     *
     * @example
     * socket.compress(false).emit("hello");
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
     * ready to send messages.
     *
     * @example
     * socket.volatile.emit("hello"); // the server may or may not receive it
     *
     * @returns self
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
     * given number of milliseconds have elapsed without an acknowledgement from the server:
     *
     * @example
     * socket.timeout(5000).emit("my-event", (err) => {
     *   if (err) {
     *     // the server did not acknowledge the event in the given delay
     *   }
     * });
     *
     * @returns self
     */
    timeout(timeout) {
        this.flags.timeout = timeout;
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @example
     * socket.onAny((event, ...args) => {
     *   console.log(`got ${event}`);
     * });
     *
     * @param listener
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @example
     * socket.prependAny((event, ...args) => {
     *   console.log(`got event ${event}`);
     * });
     *
     * @param listener
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @example
     * const catchAllListener = (event, ...args) => {
     *   console.log(`got event ${event}`);
     * }
     *
     * socket.onAny(catchAllListener);
     *
     * // remove a specific listener
     * socket.offAny(catchAllListener);
     *
     * // or remove all listeners
     * socket.offAny();
     *
     * @param listener
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     */
    listenersAny() {
        return this._anyListeners || [];
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * Note: acknowledgements sent to the server are not included.
     *
     * @example
     * socket.onAnyOutgoing((event, ...args) => {
     *   console.log(`sent event ${event}`);
     * });
     *
     * @param listener
     */
    onAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * Note: acknowledgements sent to the server are not included.
     *
     * @example
     * socket.prependAnyOutgoing((event, ...args) => {
     *   console.log(`sent event ${event}`);
     * });
     *
     * @param listener
     */
    prependAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @example
     * const catchAllListener = (event, ...args) => {
     *   console.log(`sent event ${event}`);
     * }
     *
     * socket.onAnyOutgoing(catchAllListener);
     *
     * // remove a specific listener
     * socket.offAnyOutgoing(catchAllListener);
     *
     * // or remove all listeners
     * socket.offAnyOutgoing();
     *
     * @param [listener] - the catch-all listener (optional)
     */
    offAnyOutgoing(listener) {
        if (!this._anyOutgoingListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyOutgoingListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyOutgoingListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     */
    listenersAnyOutgoing() {
        return this._anyOutgoingListeners || [];
    }
    /**
     * Notify the listeners for each packet sent
     *
     * @param packet
     *
     * @private
     */
    notifyOutgoingListeners(packet) {
        if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const listeners = this._anyOutgoingListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, packet.data);
            }
        }
    }
}
exports.Socket = Socket;

},{"./on.js":44,"@socket.io/component-emitter":10,"debug":15,"socket.io-parser":48}],46:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
const engine_io_client_1 = require("engine.io-client");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client:url"); // debug()
/**
 * URL parser.
 *
 * @param uri - url
 * @param path - the request path of the connection
 * @param loc - An object meant to mimic window.location.
 *        Defaults to window.location.
 * @public
 */
function url(uri, path = "", loc) {
    let obj = uri;
    // default to window.location
    loc = loc || (typeof location !== "undefined" && location);
    if (null == uri)
        uri = loc.protocol + "//" + loc.host;
    // relative path support
    if (typeof uri === "string") {
        if ("/" === uri.charAt(0)) {
            if ("/" === uri.charAt(1)) {
                uri = loc.protocol + uri;
            }
            else {
                uri = loc.host + uri;
            }
        }
        if (!/^(https?|wss?):\/\//.test(uri)) {
            debug("protocol-less url %s", uri);
            if ("undefined" !== typeof loc) {
                uri = loc.protocol + "//" + uri;
            }
            else {
                uri = "https://" + uri;
            }
        }
        // parse
        debug("parse %s", uri);
        obj = engine_io_client_1.parse(uri);
    }
    // make sure we treat `localhost:80` and `localhost` equally
    if (!obj.port) {
        if (/^(http|ws)$/.test(obj.protocol)) {
            obj.port = "80";
        }
        else if (/^(http|ws)s$/.test(obj.protocol)) {
            obj.port = "443";
        }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    // define unique id
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    // define href
    obj.href =
        obj.protocol +
            "://" +
            host +
            (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
}
exports.url = url;

},{"debug":15,"engine.io-client":22}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructPacket = exports.deconstructPacket = void 0;
const is_binary_js_1 = require("./is-binary.js");
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
exports.deconstructPacket = deconstructPacket;
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (is_binary_js_1.isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
}
exports.reconstructPacket = reconstructPacket;
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder === true) {
        const isIndexValid = typeof data.num === "number" &&
            data.num >= 0 &&
            data.num < buffers.length;
        if (isIndexValid) {
            return buffers[data.num]; // appropriate buffer (should be natural order anyway)
        }
        else {
            throw new Error("illegal attachments");
        }
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}

},{"./is-binary.js":49}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
const component_emitter_1 = require("@socket.io/component-emitter");
const binary_js_1 = require("./binary.js");
const is_binary_js_1 = require("./is-binary.js");
const debug_1 = require("debug"); // debug()
const debug = debug_1.default("socket.io-parser"); // debug()
/**
 * Protocol version.
 *
 * @public
 */
exports.protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encoder constructor
     *
     * @param {function} replacer - custom replacer to pass down to JSON.parse
     */
    constructor(replacer) {
        this.replacer = replacer;
    }
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        debug("encoding packet %j", obj);
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (is_binary_js_1.hasBinary(obj)) {
                obj.type =
                    obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK;
                return this.encodeAsBinary(obj);
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data, this.replacer);
        }
        debug("encoded %j as %s", obj, str);
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = binary_js_1.deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
exports.Encoder = Encoder;
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends component_emitter_1.Emitter {
    /**
     * Decoder constructor
     *
     * @param {function} reviver - custom reviver to pass down to JSON.stringify
     */
    constructor(reviver) {
        super();
        this.reviver = reviver;
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            if (this.reconstructor) {
                throw new Error("got plaintext data when reconstructing a packet");
            }
            packet = this.decodeString(obj);
            if (packet.type === PacketType.BINARY_EVENT ||
                packet.type === PacketType.BINARY_ACK) {
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emitReserved("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emitReserved("decoded", packet);
            }
        }
        else if (is_binary_js_1.isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emitReserved("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = this.tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        debug("decoded %s as %j", str, p);
        return p;
    }
    tryParse(str) {
        try {
            return JSON.parse(str, this.reviver);
        }
        catch (e) {
            return false;
        }
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return typeof payload === "object";
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || typeof payload === "object";
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return Array.isArray(payload) && payload.length > 0;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    }
}
exports.Decoder = Decoder;
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = binary_js_1.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}

},{"./binary.js":47,"./is-binary.js":49,"@socket.io/component-emitter":10,"debug":15}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBinary = exports.isBinary = void 0;
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
exports.isBinary = isBinary;
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}
exports.hasBinary = hasBinary;

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

var _nil = _interopRequireDefault(require("./nil.js"));

var _version = _interopRequireDefault(require("./version.js"));

var _validate = _interopRequireDefault(require("./validate.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nil.js":53,"./parse.js":54,"./stringify.js":58,"./v1.js":59,"./v3.js":60,"./v4.js":62,"./v5.js":63,"./validate.js":64,"./version.js":65}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = '0123456789abcdef';

  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 0xff;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));

  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var _default = {
  randomUUID
};
exports.default = _default;
},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;
},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;
},{"./validate.js":64}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;
},{}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);

  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);

    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }

    M[i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);

    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }

    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];

    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
},{}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.unsafeStringify = unsafeStringify;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;
},{"./validate.js":64}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = require("./stringify.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.unsafeStringify)(b);
}

var _default = v1;
exports.default = _default;
},{"./rng.js":56,"./stringify.js":58}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./md5.js":51,"./v35.js":61}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URL = exports.DNS = void 0;
exports.default = v35;

var _stringify = require("./stringify.js");

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;

    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.unsafeStringify)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./parse.js":54,"./stringify.js":58}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _native = _interopRequireDefault(require("./native.js"));

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = require("./stringify.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  if (_native.default.randomUUID && !buf && !options) {
    return _native.default.randomUUID();
  }

  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.unsafeStringify)(rnds);
}

var _default = v4;
exports.default = _default;
},{"./native.js":52,"./rng.js":56,"./stringify.js":58}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./sha1.js":57,"./v35.js":61}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(require("./regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;
},{"./regex.js":55}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.slice(14, 15), 16);
}

var _default = version;
exports.default = _default;
},{"./validate.js":64}]},{},[1]);
