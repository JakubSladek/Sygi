if (Number(process.version.slice(1).split(".")[0]) < 8)
  throw new Error(
    "Node 8.0.0 or higher is required. Update Node on your system."
  );

const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

client.config = require("./config.json");
client.tempMsg = require("./utils/tempMsg");

const init = async () => {
  // Load commands
  client.commands = new Discord.Collection();

  const commandFolders = ["", "moderation"];
  commandFolders.forEach((folder) => {
    if(folder.length > 0) folder += "/";
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}${file}`);
      client.commands.set(command.name, command);
    }
  });
  

  // Load events
  const eventFiles = fs
    .readdirSync(`./events/`)
    .filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  }

  // Bot login
  client.login(client.config.TOKEN);
};

init();
