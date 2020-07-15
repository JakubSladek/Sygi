const { ADMIN_ROLE } = require(`../../../config.json`);
const tempMsg = require(`../../../utils/tempMsg`);

module.exports = {
  getMember(message) {
    return new Promise((resolve, reject) => {
      let member = message.mentions.members.first();
      if (!message.member.roles.cache.find((r) => r.name === ADMIN_ROLE)) {
        tempMsg.send(
          message,
          "Sorry, you don't have permissions to use this command!"
        );
        reject("No permissions.")
      } else if (!member) {
        tempMsg.send(
          message,
          "Please mention a valid member of this server :smile:"
        );
        reject("Mention not set.");
      } else {
        resolve(member);
      }
    });
  },
};
