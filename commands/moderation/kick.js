const Discord = require("discord.js");
const utils = require(`./utils/getMember.js`);

module.exports = {
  name: "kick",
  description: "kick command",
  async execute(client, message, args) {
    try {
      const member = await utils.getMember(message);
      let reason = args.slice(2).join(" ");

      if (!reason) {
        return client.tempMsg.send(message, `Please give a reason for kick.`);
      }

      const embedPreview = new Discord.MessageEmbed()
        .setAuthor(member.user.tag)
        .setDescription("**Reason:** " + reason)
        .setColor("#ffff00")
        .setFooter("This user has 0 warnings, 0 mutes, 0 kicks, and 0 bans.");

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(
          `You were kicked from the server.\n\n**Reason:** ${reason}`
        )
        .setColor("#FF0000")
        .setFooter(
          `\nIf you do not get why you were kicked, please DM ${message.author.tag}`
        );

      client.tempMsg.send(
        message,
        `Are you sure you want to issue this kick? (__y__es | __n__o)`
      );

      client.tempMsg.send(message, embedPreview);

      const collector = new Discord.MessageCollector(
        message.channel,
        (m) => m.author.id === message.author.id,
        { time: client.config.MSG_TIMEOUT }
      );
      collector.on("collect", (msg) => {
        m = msg.content.toLowerCase();
        if (m == "yes") {
          member.send(embedDM);
          member
            .kick(reason)
            .then(function () {
              return msg.channel.send(`Successfully kicked ${member.user.tag}`);
            })
            .catch(console.error);
        } else if (m == "no") {
          return client.tempMsg.send(msg, "Kick cancelled.");
        }
      });
    } catch (e) {
      console.error(e);
    }
  },
};
