const Discord = require("discord.js");
const { getEmbed } = require(`./utils/getEmbed.js`);

module.exports = {
  name: "kick",
  permission: "mod",
  description: "kick command",
  async execute(client, message, args) {
    try {
      const embedHelp = new Discord.MessageEmbed()
        .setAuthor(`Command: ${message.prefix}${this.name}`)
        .setDescription(
          `
        **Description:** ${this.name} a member from guild.
        **Usage:** ${message.prefix}${this.name} [user] [reason]
        **Example:**
        ${message.prefix}${this.name} @NoobLance Shitposting
        ${message.prefix}${this.name} @User spamming
        ${message.prefix}${this.name} @NoobLance Too Cool
        ${message.prefix}${this.name} @NoobLance He asked for it
      `
        )
        .setColor("#0f0f0f");

      if (args.length < 3 || !message.mentions.members.first()) return client.tempMsg.send(message, embedHelp);
      let memberid = args[1].replace(/[^0-9]/g, "");
      let member = memberid == message.mentions.members.first().user.id ? message.mentions.members.first() : null;
      let reason = args.slice(2).join(" ");

      if (!reason || !member) return client.tempMsg.send(message, embedHelp);

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(`You were kicked from the server.\n\n**Reason:** ${reason}`)
        .setColor("#FF0000")
        .setFooter(`\nIf you do not get why you were kicked, please DM ${message.author.tag}`);

      const embedPreview = await getEmbed(client, member, reason);

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
