const Discord = require("discord.js");
const utils = require(`./utils/getMember.js`);
const { getEmbed } = require(`./utils/getEmbed.js`);

module.exports = {
  name: "ban",
  description: "ban command",
  async execute(client, message, args) {
    try {
      const member = await utils.getMember(message);
      if (!member.bannable)
        return client.tempMsg.send(
          message,
          "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
        );
      let reason = args.slice(2).join(" ");

      if (!reason) {
        return client.tempMsg.send(message, `Please give a reason for ban.`);
      }

      const embedPreview = await getEmbed(client, member, reason);

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(`You were banned from the server.\n\n**Reason:** ${reason}`)
        .setColor("#FF0000")
        .setFooter(`\nIf you do not get why you were banned, please DM ${message.author.tag}`);

      client.tempMsg.send(message, `Are you sure you want to issue this ban? (__y__es | __n__o)`);

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
          msg.author
            .send(embedDM)
            .then(function () {
              member.ban(reason).then(function () {
                msg.channel.send(`Successfully banned ${member.user.tag}`);
                return client.storeUserData(member.id, ["ban"]);
              });
            })
            .catch(console.error);
        } else if (m == "no") {
          return client.tempMsg.send(msg, "Ban cancelled.");
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
