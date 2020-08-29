const Discord = require("discord.js");
const { getEmbed } = require(`./utils/getEmbed.js`);

module.exports = {
  name: "ban",
  permission: "mod",
  description: "ban command",
  async execute(client, message, args) {
    try {
      const embedHelp = new Discord.MessageEmbed()
        .setAuthor(`Command: ${message.prefix}ban`)
        .setDescription(
          `
        **Description:** Ban a member from guild.
        **Usage:** ${message.prefix}ban [user] [reason]
        **Example:**
        -ban @NoobLance Shitposting
        -ban @User spamming
        -ban @NoobLance Too Cool
        -ban @NoobLance He asked for it
          `
        )
        .setColor("#0f0f0f");

      if (args.length < 3 || !message.mentions.members.first()) return client.tempMsg.send(message, embedHelp);
      let memberid = args[1].replace(/[^0-9]/g, "");
      let member = memberid == message.mentions.members.first().user.id ? message.mentions.members.first() : null;
      let reason = args.slice(2).join(" ");

      if (!reason || !member) return client.tempMsg.send(message, embedHelp);

      if (!member.bannable) return client.tempMsg.send(message, "I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

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

      collector.on("collect", async (msg) => {
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
