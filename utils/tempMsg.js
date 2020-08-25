const { MSG_TIMEOUT } = require(`../config.json`);

module.exports = {
  name: "tempMsg",
  description: "temporary messages utility",
  async send(message, content, TIMEOUT) {
    return new Promise(async (resolve, reject) => {
      msg = await message.channel.send(content);
      msg.delete({ timeout: TIMEOUT || MSG_TIMEOUT });
      resolve(true)
    });
  },
  async delete(message, TIMEOUT) {
    return new Promise ((resolve, reject) => {
      message.delete({ timeout: TIMEOUT || MSG_TIMEOUT }).catch(console.error);
      resolve(true);
    });
  },
};
