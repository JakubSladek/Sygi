if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

require("dotenv").config();

const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

client.config = require("./config.json");
client.dataPath = "./data/users/";
client.tempMsg = require("./utils/tempMsg");
client.db = require("quick.db");

//#region Init
const init = async () => {
  //#region Commands
  client.commands = new Discord.Collection();

  fs.readdirSync("commands", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const folder = dirent.name;
      fs.readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"))
        .map((file) => {
          const command = require(`./commands/${folder}/${file}`);
          client.commands.set(command.name, command);
        });
    });
  //#endregion

  //#region Events
  fs.readdirSync(`./events/`)
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const eventName = file.split(".")[0];
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
    });
  //#endregion

  // Bot login
  client.login(process.env.TOKEN);
};
//#endregion Init

init();
