module.exports = (client) => {
  console.log("Bot is booting up!");
  client.user
    .setPresence({
      activity: { name: `${client.config.BOT_NAME} | ${client.config.PREFIX}help`, type: `WATCHING` },
    })
    .catch(console.error);
};
