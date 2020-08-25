const Discord = require("discord.js");

module.exports = {
  getEmbed(client, member, reason) {
    return new Promise((resolve, reject) => {
        data = {
          warns: client.db.get(`guilds.guild_${member.guild.id}.users.${member.user.id}.warns`) || 0,
          kicks: client.db.get(`guilds.guild_${member.guild.id}.users.${member.user.id}.kicks`) || 0,
          bans: client.db.get(`guilds.guild_${member.guild.id}.users.${member.user.id}.bans`) || 0,
          muted: client.db.get(`guilds.guild_${member.guild.id}.users.${member.user.id}.muted`) || 0
        }
        const embedPreview = new Discord.MessageEmbed()
          .setAuthor(member.user.tag)
          .setDescription("**Reason:** " + reason)
          .setColor("#ffff00")
          .setFooter(
            `This user has ${data.warns} warnings, ${data.kicks} kicks, ${data.bans} bans and got muted ${data.muted} times.`
          );
        resolve(embedPreview);
    });
  },
};
