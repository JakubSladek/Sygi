const Discord = require("discord.js");

module.exports = {
  getEmbed(client, member, reason) {
    return new Promise((resolve, reject) => {
      client.storeUserData(member.id, ["kick"], (data) => {
        const embedPreview = new Discord.MessageEmbed()
          .setAuthor(member.user.tag)
          .setDescription("**Reason:** " + reason)
          .setColor("#ffff00")
          .setFooter(
            `This user has ${data.warns} warnings, ${data.kicks} kicks, and ${data.bans} bans.`
          );
        resolve(embedPreview);
      });
    });
  },
};
