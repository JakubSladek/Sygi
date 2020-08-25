module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  const prefix = client.db.get(`guilds.guild_${message.guild.id}.prefix`) || client.config.PREFIX;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.substring(prefix.length).split(" ");
  const command = args[0];

  if (!client.commands.get(command)) return message.delete();

  client.commands.get(command).execute(client, message, args);
  client.tempMsg.delete(message);
};
