const Discord = require("discord.js");
const utils = require(`./utils/getMember.js`);
const { getEmbed } = require(`./utils/getEmbed.js`);

module.exports = {
  name: "kick",
  description: "kick command",
  async execute(client, message, args) {
    try {
      const member = await utils.getMember(message);
      let reason = args.slice(2).join(" ");

      if (!reason) return client.tempMsg.send(message, `Please give a reason for kick.`);

      const embedPreview = await getEmbed(client, member, reason);

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(`You were kicked from the server.\n\n**Reason:** ${reason}`)
        .setColor("#FF0000")
        .setFooter(`\nIf you do not get why you were kicked, please DM ${message.author.tag}`);

      client.tempMsg.send(message, `Are you sure you want to issue this kick? (__y__es | __n__o)`);

      client.tempMsg.send(message, embedPreview);

      const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: client.config.MSG_TIMEOUT });
      collector.on("collect", async (msg) => {
        m = msg.content.toLowerCase();
        if (m == "yes" || m == "no") collector.stop();
        if (m == "yes") {
          await member.send(embedDM);
          member.kick(reason);
          client.db.add(`guilds.guild_${message.guild.id}.users.${member.user.id}.kicks`, 1);
          msg.channel.send(`Successfully kicked ${member.user.tag}`);
        } else if (m == "no") {
          client.tempMsg.send(msg, "Kick cancelled.");
        }
      });
    } catch (e) {
      console.error(e);
    }
  },
};
