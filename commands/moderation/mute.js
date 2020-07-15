const Discord = require("discord.js");
const utils = require(`./utils/getMember.js`);

module.exports = {
  name: "mute",
  description: "mute command",
  async execute(client, message, args) {
    try {
      const embedHelp = new Discord.MessageEmbed()
        .setAuthor(`Command: ${client.config.PREFIX}mute`)
        .setDescription(
          `
          **Description:** Mute a member so they cannot type or speak, time limit in minutes.
          **Cooldown:** 3 seconds
          **Usage:** -mute [user] [limit] [reason]
          **Example:**
          -mute @NoobLance 10 Shitposting
          -mute User 10m spamming
          -mute NoobLance 1d Too Cool
          -mute NoobLance 5h He asked for it
        `
        )
        .setColor("#0f0f0f");

      const member = await utils.getMember(message);
      let reason = args.slice(3).join(" ");
      let timeout = args.slice(2).join(" ");
      timeout = timeout.split(" ")[0];
      if (!reason || !timeout) return client.tempMsg.send(message, embedHelp);

      const embedPreview = new Discord.MessageEmbed()
        .setAuthor(member.user.tag)
        .setDescription("**Reason:** " + reason)
        .setColor("#ffff00")
        .setFooter("This user has 0 warnings, 0 mutes, 0 kicks, and 0 bans.");

      const embedDM = new Discord.MessageEmbed()
        .setAuthor(message.guild.name)
        .setThumbnail(message.guild.iconURL(true))
        .setDescription(
          `You were muted on the server for ${timeout}.\n\n**Reason:** ${reason}`
        )
        .setColor("#FF0000")
        .setFooter(
          `\nIf you do not get why you were muted, please DM ${message.author.tag}`
        );

      let mainRole = message.guild.roles.cache.find(
        (role) => role.name === "member"
      );
      let muteRole = message.guild.roles.cache.find(
        (role) => role.name === "mute"
      );

      if (!muteRole)
        return client.tempMsg.send(message, "Mute role doesn't exist!");
      if (!mainRole)
        return client.tempMsg.send(message, "Member role doesn't exist!");

      let minutes;
      if (timeout.match(/^\d+h$/g)) {
        let x = timeout.replace("h", "");
        minutes = parseInt(x) * 60;
      } else if (timeout.match(/^\d+m$/g)) {
        minutes = timeout.replace("m", "");
      } else if (timeout.match(/^\d+d$/g)) {
        days = timeout.replace("d", "");
        minutes = parseInt(timeout) * 60 * 24;
      } else {
        return client.tempMsg.send(message, embedHelp);
      }

      let msTime = minutes * 60 * 1000;

      client.tempMsg.send(
        message,
        `Are you sure you want to issue this mute? (__y__es | __n__o)`
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
          member.roles.remove(mainRole.id).catch(console.error);
          member.roles
            .add(muteRole)
            .then(function () {
              msg.channel.send(
                `Successfully muted ${member.user.tag} for ${timeout}.`
              );
            })
            .catch(console.error);

          return setTimeout(function () {
            if (!member.roles.cache.find((role) => role.name === "member"))
              return member.roles.add(mainRole).catch(console.error);

            if (member.roles.cache.find((role) => role.name === "mute")) {
              return member.roles.remove(muteRole.id).catch(console.error);
            }
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
