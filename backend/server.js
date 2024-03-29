require("dotenv").config();
const { MongoClient } = require("mongodb");
const { init, send } = require("@emailjs/browser");
init(process.env.EMAILJS);
const winston = require("winston");
const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");
const { hostname } = require("os");
require("winston-syslog");
const { Configuration, OpenAIApi } = require("openai");
const stringy = require("stringy");
const papertrail = new winston.transports.Syslog({
  host: "logs2.papertrailapp.com",
  port: 53939,
  protocol: "tls4",
  localhost: hostname(),
  eol: "\n",
});

const logger = winston.createLogger({
  format: winston.format.simple(),
  levels: winston.config.syslog.levels,
  transports: [papertrail],
});
logger.info("INIT APP");

function sendMail(email, subject, message) {
  //send mail
  send("GrindHub", "template_cpoi5e7", {
    email: email,
    subject: subject,
    message: message,
  }).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
      return 0;
    },
    function (error) {
      console.log("FAILED...", error);
      return 1;
    }
  );
  return 0;
}
async function main() {
  logger.info("START MONGO");
  const mongo = await MongoClient.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  });
  logger.info("END MONGO");
  const app = express();
  logger.info("START OPENAI");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI,
  });
  const openai = new OpenAIApi(configuration);
  logger.info("END OPENAI");
  const allowedOrigins = [
    "http://localhost:3000",
    "https://grindhub.notaroomba.dev",
    "https://notaroomba.dev",
    "http://grindhub.notaroomba.dev",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
  app.use(bodyparser.json());

  app.get("/", (req, res) => {
    res.send("Hey you're not supposed to be here!");
  });
  app.post("/user", (req, res) => {
    const users = mongo.db("userData").collection("users");
    users
      .findOne(req.body)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.send(err);
      });
  });
  app.get("/users", async (req, res) => {
    const users = mongo.db("userData").collection("users");
    res.json(await users.find().toArray());
  });
  app.post("/email", (req, res) => {
    res.end(sendMail(req.body));
  });
  app.post("/signup", async (req, res) => {
    const users = mongo.db("userData").collection("users");
    try {
      await users.insertOne(req.body);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(200);
    }
  });
  app.post("/missions", async (req, res) => {
    const missions = mongo.db("userData").collection("missions");
    res.send(await missions.find(req.body[0], req.body[1]).toArray());
  });
  app.post("/missionsupdate", async (req, res) => {
    const missions = mongo.db("userData").collection("missions");
    try {
      await missions.insertOne(req.body);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  });
  app.post("/userupdate", async (req, res) => {
    const users = mongo.db("userData").collection("users");
    await users.updateOne(req.body[0], req.body[1]);
    res.sendStatus(200);
  });
  app.get("/getmissions", async (req, res) => {
    const completion = await openai
      .createCompletion({
        model: "text-davinci-003",
        max_tokens: 3500,
        prompt:
          'write this data into a json object: write 12 missions about daily habits or wellbeing and categorize them into categories made up of defense, intelligence and strength. They should be in 2 groups of 6 missions divided into 3 groups of 2, also write a stat for each of them upgrading their parent category by a random number under 20. Make a description for each of the missions then write all the values into a json object using only the values: name, description, category, upgrade. make the keys lowercase, an example of this would be ``` { "missions": [{"name": "Drink Water", "description": "Drink some water for your health", "category": "defense", "upgrade": 12] ,...}``` make sure that the array of missions has 12 objects and that the categories are in lowercase',
      })
      .catch((err) => logger.info(err));
    if (completion.status >= 500) return res.end(completion.status);
    let json = null;
    try {
      console.log(
        `Before: ${completion.data.choices[0].text.replace(/\r?\n|\r/g, "")}`
      );
      json = JSON.parse(
        completion.data.choices[0].text.replace(/\r?\n|\r/g, "")
      );
    } catch (e) {
      try {
        json = JSON.parse(
          completion.data.choices[0].text
            .replace(/\r?\n|\r/g, "")
            .split("```")[1]
        );
        console.log(`After: ${json}`);
      } catch (e) {
        console.log(`Error occured abusing OpenAI: ${e}`);
      }
    }
    logger.info(json);
    res.json(json);
  });
  logger.info("STARTING SERVER");
  // start the server
  app.listen(3001, (err) => {
    if (err) console.log("Error in server setup: " + err);
    console.log("Server listening on port 3001");
  });
}

main().then();
