const url = require('url');
const querystring = require('querystring');
require('dotenv').config();
const { MongoClient } = require('mongodb');
var sha256 = require('js-sha256');
const emailjs = require('@emailjs/browser')
emailjs.init(process.env.EMAILJS)
const bodyParser = require('body-parser') 
const express = require('express')
const cors = require('cors');
const { error } = require('console');
const os = require('os');
require('winston-syslog');

function main () {
  MongoClient.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true }).then(mongo => {
  const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});
const openai = new OpenAIApi(configuration);

const app = express()


const allowedOrigins = ['http://localhost:3000', 'https://grindhub.notaroomba.xyz', 'https://notaroomba.xyz', 'http://grindhub.notaroomba.xyz'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
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

app.get('/', async (req, res) => {
  res.send("Hey you're not supposed to be here!")
})
app.post('/user', (req, res) => {
  const users = mongo.db("userData").collection("users");
  users.findOne(req.body).then(user => {
    res.send(user);
  }).catch(err => {
    res.send(err)
  })
})
app.post('/users', async (req, res) => {
  const users = mongo.db("userData").collection("users");
  res.json(await users.find().toArray());
})
app.post('/email', (req, res) => {
    res.end(sendMail(req.body));
})
app.post('/signup',async (req, res) => {
const users = mongo.db("userData").collection("users");
    try {
      await users.insertOne(req.body)
      res.end(0);
    } catch (e) {
      console.log(e)
      res.end(1);
    }
}) 
app.post('/missions',async (req, res) => {
  const missions = mongo.db("userData").collection("missions");
    res.send(await missions.find(req.body).toArray());
})
app.post('/missionsupdate',async (req, res) => {
  const missions = mongo.db("userData").collection("missions");
  try {
    await missions.insertOne(req.body)
    res.end(0);
  } catch (e) {
    console.log(e)
    res.end(1);
  }
})
app.post('/userupdate',async  (req, res) => {
const users = mongo.db("userData").collection("users");
    await userCollection.updateOne(req.body)
    res.send(0)
})
app.get("/getmissions"), async (req, res) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "write this data into a json object: write 12 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 2 groups of 6 missions divided into 3 groups of 2, also write a stat for each of them upgrading their parent category by a random number under 20. Make a description for each of the missions then write all the values into a json object using only the values: name, description, category, upgrade",
  });
  res.json(completion)
}
  
// start the server
app.listen(3001, (err) => {
  if (err) console.log("Error in server setup: " + err)
  console.log('Server listening on port 3001');
})
  }).catch((err) => {
    console.log(err)
    logger.error(err)
})
}

main()