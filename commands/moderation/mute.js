const Discord = require("discord.js");
const utils = require(`./utils/getMember.js`);
const { getEmbed } = require(`./utils/getEmbed.js`);

module.exports = {
  name: "mute",
  permission: "mod",
  description: "mute command",
  async execute(client, message, args) {
    try {
      const embedHelp = new Discord.MessageEmbed()
        .setAuthor(`Command: ${message.prefix}mute`)
        .setDescription(
          `
          **Description:** Mute a member so they cannot type or speak, time limit in minutes.
          **Usage:** ${message.prefix}mute [user] [limit] [reason]
          **Example:**
          -mute @NoobLance 10 Shitposting
          -mute @User 10m spamming
          -mute @NoobLance 1d Too Cool
          -mute @NoobLance 5h He asked for it
        `
        )
        .setColor("#0f0f0f");

      let memberid = args[1].replace(/[^0-9]/g, "");
      let member = memberid == message.mentions.members.first().user.id ? message.mentions.members.first() : null;
      let timeout = args.slice(2).join(" ").split(" ")[0];
      let reason = args.slice(3).join(" ");

      if (!member || !reason || !timeout) return client.tempMsg.send(message, embedHelp);

      let mutedUsers = await client.db.get(`guilds.guild_${message.guild.id}.mutedUsers`);

      if (mutedUsers && mutedUsers.includes(member.user.id)) return client.tempMsg.send(message, `${member.user.tag} is already muted!`);

      const embedPreview = await getEmbed(client, member, reason);

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(`You were muted on the server for ${timeout}.\n\n**Reason:** ${reason}`)
        .setColor("#FF0000")
        .setFooter(`\nIf you do not get why you were muted, please DM ${message.author.tag}`);

      let mainRole = message.guild.roles.cache.find((role) => role.name === "member");
      let muteRole = message.guild.roles.cache.find((role) => role.name === "mute");

      if (!muteRole) return client.tempMsg.send(message, "Mute role doesn't exist!");
      if (!mainRole) return client.tempMsg.send(message, "Member role doesn't exist!");

      let minutes;

      if (timeout.match(/^\d+h$/g)) {
        let x = timeout.replace("h", "");
        minutes = parseInt(x) * 60;
      } else if (timeout.match(/^\d+m$/g)) minutes = timeout.replace("m", "");
      else if (timeout.match(/^\d+d$/g)) {
        days = timeout.replace("d", "");
        minutes = parseInt(timeout) * 60 * 24;
      } else return client.tempMsg.send(message, embedHelp);

      let msTime = minutes * 60 * 1000;

      await client.tempMsg.send(message, `Are you sure you want to issue this mute? (__y__es | __n__o)`);
      await client.tempMsg.send(message, embedPreview);

      const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: client.config.MSG_TIMEOUT });

      collector.on("collect", (msg) => {
        m = msg.content.toLowerCase();
        if (m == "yes" || m == "no") collector.stop();
        if (m == "yes") {
          let successAnswer = `Successfully muted ${member.user.tag} for ${timeout}.`;

          if (mutedUsers && mutedUsers.includes(member.user.id)) {
            let index = mutedUsers.indexOf(member.user.id);
            mutedUsers.splice(index, 1);
            client.db.set(`guilds.guild_${message.guild.id}.mutedUsers`, mutedUsers);
          }

          member.roles.remove(mainRole.id);
          member.send(embedDM);
          member.roles.add(muteRole);
          msg.channel.send(successAnswer);
          client.db.push(`guilds.guild_${message.guild.id}.mutedUsers`, member.user.id);
          client.db.add(`guilds.guild_${message.guild.id}.users.${member.user.id}.muted`, 1);

          return setTimeout(() => {
            if (mutedUsers && mutedUsers.includes(member.user.id)) {
              let index = mutedUsers.indexOf(member.user.id);
              mutedUsers.splice(index, 1);
              client.db.set(`guilds.guild_${message.guild.id}.mutedUsers`, mutedUsers);
            }

            if (!member.roles.cache.find((role) => role.name === "member")) member.roles.add(mainRole);
            if (member.roles.cache.find((role) => role.name === "mute")) member.roles.remove(muteRole.id);
          }, msTime);
        } else if (m == "no") {
          return client.tempMsg.send(msg, "Mute cancelled.");
        }
      });
    } catch (e) {
      console.error(e);
    }
  },
};
