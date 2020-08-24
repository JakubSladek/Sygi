if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

require("dotenv").config();

const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const db = require('quick.db');

client.config = require("./config.json");
client.dataPath = "./data/users/";
client.tempMsg = require("./utils/tempMsg");

//#region Init
const init = async () => {
  //#region Commands
  client.commands = new Discord.Collection();

  const commandFolders = ["", "moderation"];
  commandFolders.forEach((folder) => {
    if (folder.length > 0) folder += "/";
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}${file}`);
      client.commands.set(command.name, command);
    }
  });
  //#endregion

  //#region Events
  // Load events
  const eventFiles = fs.readdirSync(`./events/`).filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  }
  //#endregion

  //#region Store data
  client.storeUserData = (id, args, callback) => {
    const dataObj = {
      warns: 0,
      kicks: 0,
      bans: 0,
    };

    if (args) {
      if (args.includes("warn")) dataObj.warns++;
      if (args.includes("kick")) dataObj.kicks++;
      if (args.includes("ban")) dataObj.bans++;
    }

    fs.exists(`${client.dataPath}${id}.json`, (exists) => {
      if (!exists) {
        fs.writeFile(`${client.dataPath}${id}.json`, JSON.stringify(dataObj, null, " "), (err) => {
          if (err) throw err;
          if (callback) callback(dataObj);
          return;
        });
      } else {
        fs.readFile(`${client.dataPath}${id}.json`, (err, storedData) => {
          if (err) throw err;

          storedData = JSON.parse(storedData);

          dataObj.warns = storedData.warns + dataObj.warns;
          dataObj.kicks = storedData.kicks + dataObj.kicks;
          dataObj.bans = storedData.bans + dataObj.bans;

          fs.writeFile(`${client.dataPath}${id}.json`, JSON.stringify(dataObj, null, " "), (err) => {
            if (err) throw err;
            if (callback) callback(dataObj);
            return;
          });
        });
      }
    });
    //#endregion
  };

  // Bot login
  client.login(process.env.TOKEN);
};
//#endregion Init

init();
