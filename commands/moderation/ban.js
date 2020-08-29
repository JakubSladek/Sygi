const Discord = require("discord.js");
const utils = require(`./utils/getMember.js`);
const { getEmbed } = require(`./utils/getEmbed.js`);

module.exports = {
  name: "ban",
  permission: "Admin",
  description: "ban command",
  async execute(client, message, args) {
    try {
      const embedHelp = new Discord.MessageEmbed()
      .setAuthor(`Command: ${message.prefix}ban`)
      .setDescription(
        `
        **Description:** Kick a member from guild.
        **Usage:** ${message.prefix}kick [user] [limit] [reason]
        **Example:**
        -kick @NoobLance Shitposting
        -kick @User spamming
        -kick @NoobLance Too Cool
        -kick @NoobLance He asked for it
      `
      )
      .setColor("#0f0f0f");

      const member = await utils.getMember(message);

      if (!member.bannable)
        return client.tempMsg.send(
          message,
          "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
        );

      let reason = args.slice(2).join(" ");

      if (!reason) return client.tempMsg.send(message, embedHelp);
      
      const embedPreview = await getEmbed(client, member, reason);

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(`You were banned from the server.\n\n**Reason:** ${reason}`)
        .setColor("#FF0000")
        .setFooter(`\nIf you do not get why you were banned, please DM ${message.author.tag}`);

      client.tempMsg.send(message, `Are you sure you want to issue this ban? (__y__es | __n__o)`);
      client.tempMsg.send(message, embedPreview);

      const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: client.config.MSG_TIMEOUT });

      collector.on("collect", (msg) => {
        m = msg.content.toLowerCase();
        if (m == "yes" || m == "no") collector.stop();
        if (m == "yes") {
          await member.send(embedDM);
          member.ban(reason);
          client.db.add(`guilds.guild_${message.guild.id}.users.${member.user.id}.bans`, 1);
          msg.channel.send(`Successfully banned ${member.user.tag}`);
        } else if (m == "no") {
          client.tempMsg.send(msg, "Ban cancelled.");
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
