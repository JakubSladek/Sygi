const Discord = require("discord.js");

module.exports = {
  name: "setprefix",
  description: "ban command",
  async execute(client, message, args) {
    try {
      if (!args[1] || args.length > 2) return client.tempMsg.send(message, "Please write this command again with right parameters.\ne.g. !setprefix s!");
      const newPrefix = args[1];
      if (newPrefix.length > 10) return client.tempMsg.send(message, "Cannot set prefix, maximum length of prefix is 10 chars.");
      client.db.set(`guilds.guild_${message.guild.id}`, { prefix: newPrefix });
      client.tempMsg.send(message, `Prefix successfully changed to: ${newPrefix}`);
    } catch (e) {
      console.log(e);
    }
  },
};
