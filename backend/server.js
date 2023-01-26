const url = require('url');
const querystring = require('querystring');
require('dotenv').config();
const { MongoClient } = require('mongodb');
var sha256 = require('js-sha256');
const emailjs = require('@emailjs/browser')
emailjs.init(process.env.EMAILJS)
const bodyParser = require('body-parser') 
const express = require('express')
const cors = require('cors')


async function main () {
  const mongo = await MongoClient.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true }).catch((err) => {
    console.log(err)
  })
const app = express()


const allowedOrigins = ['http://localhost:3000', 'https://grindhub.notaroomba.xyz', 'https://notaroomba.xyz', '*'];
 
var corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//app.use(cors(corsOptions));
app.use(bodyParser.json())

function sendMail(email, subject, message) {
  //send mail
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
// app.use('/user', cors());
// app.use('/users', cors());
// app.use('/signup', cors());
// app.use('/missions', cors());
// app.use('/missionsupdate', cors());
// app.use('/userupdate', cors());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://grindhub.notaroomba.xyz");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.get('/', cors(corsOptions), async (req, res) => {
  res.send("Hey you're not supposed to be here!")
})
app.post('/user',cors(corsOptions), async (req, res) => {
  const users = mongo.db("userData").collection("users");
  const data = JSON.parse(req.body);
  let user = await users.findOne(data)
  res.json(user);
})
app.post('/users', cors(corsOptions), async (req, res) => {
  const users = mongo.db("userData").collection("users");
  res.json(await users.find().toArray());
})
app.post('/email',cors(corsOptions), (req, res) => {
    const data = JSON.parse(body);
    res.end(sendMail(data));
})
app.post('/signup',cors(corsOptions),async (req, res) => {
const users = mongo.db("userData").collection("users");
    const data = JSON.parse(body);
    try {
      await users.insertOne(data)
      res.end(0);
    } catch (e) {
      console.log(e)
      res.end(1);
    }
}) 
app.post('/missions',cors(corsOptions),async (req, res) => {
  const missions = mongo.db("userData").collection("missions");
    const data = JSON.parse(req.body);
    res.end(await missions.find(data));
})
app.post('/missionsupdate',cors(corsOptions),async (req, res) => {
  const missions = mongo.db("userData").collection("missions");
  const data = JSON.parse(req.body);
  try {
    await missions.insertOne(data)
    res.end(0);
  } catch (e) {
    console.log(e)
    res.end(1);
  }
})
app.post('/userupdate',cors(corsOptions),async  (req, res) => {
const users = mongo.db("userData").collection("users");
    const data = JSON.parse(req.body);
    await userCollection.updateOne(data)
    res.send(0)
})
  
// start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
})

}

main().then()