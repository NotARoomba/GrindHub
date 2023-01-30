import * as dotenv from 'dotenv'
dotenv.config()
import { MongoClient } from 'mongodb';
import { init, send } from '@emailjs/browser';
init(process.env.EMAILJS)
import { transports as _transports, createLogger, format as _format, config } from 'winston';
import bodyparser from 'body-parser'; 
import express from 'express';
import cors from 'cors';
import { hostname } from 'os';
import 'winston-syslog';
import chatGPT from "chatgpt-io"; 
const papertrail = new _transports.Syslog({
  host: 'logs2.papertrailapp.com',
  port: 53939,
  protocol: 'tls4',
  localhost: hostname(),
  eol: '\n',
});

const logger = createLogger({
  format: _format.simple(),
  levels: config.syslog.levels,
  transports: [papertrail],
});
logger.info('INIT APP')
async function main () {
  const mongo = await MongoClient.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true })
const app = express()

let bot = new chatGPT(process.env.OPENAI_TOKEN);
logger.info("CHATGPT INIT")
await bot.waitForReady().then(() => logger.info("CHATGPT READY")).catch(err => logger.info(err))
const allowedOrigins = ['http://localhost:3000', 'https://grindhub.notaroomba.xyz', 'https://notaroomba.xyz', 'http://grindhub.notaroomba.xyz'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyparser.json())

function sendMail(email, subject, message) {
  //send mail
  send('GrindHub', 'template_cpoi5e7', { email: email, subject: subject, message: message })
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
app.get("/getmissions", async (req, res) => {
  logger.info("GETTING MISSIONS")
  let response = await bot.ask("write this data into a json object: write 12 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 2 groups of 6 missions divided into 3 groups of 2, also write a stat for each of them upgrading their parent category by a random number under 20. Make a description for each of the missions then write all the values into a json object using only the values: name, description, category, upgrade. make the keys lowercase").then(res => logger.info(res)).catch(err => logger.info(err))
  logger.info(response)
  res.send(response)
})
  
// start the server
app.listen(3001, (err) => {
  if (err) console.log("Error in server setup: " + err)
  console.log('Server listening on port 3001');
})
}

main().then()