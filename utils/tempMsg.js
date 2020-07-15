const { MSG_TIMEOUT } = require(`../config.json`);

module.exports = {
  name: "tempMsg",
  description: "temporary messages utility",
  send(message, content, TIMEOUT) {
    message.channel
      .send(content)
      .then((msg) => {
        msg.delete({ timeout: TIMEOUT || MSG_TIMEOUT });
      })
      .catch(console.error);
  },
  delete(message, TIMEOUT) {
    message.delete({ timeout: TIMEOUT || MSG_TIMEOUT }).catch(console.error);
  },
};
