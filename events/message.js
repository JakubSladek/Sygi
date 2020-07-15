module.exports = async (client, message) => {
  if (message.author.bot || !message.content.startsWith(client.config.PREFIX)) return;

  const args = message.content
    .substring(client.config.PREFIX.length)
    .split(" ");

  if (!client.commands.get(args[0])) return message.delete();

  client.commands.get(args[0]).execute(client, message, args);
  client.tempMsg.delete(message);
};
