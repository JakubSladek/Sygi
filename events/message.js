const tempMsg = require("../utils/tempMsg");

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  message.prefix = client.db.get(`guilds.guild_${message.guild.id}.prefix`) || client.config.PREFIX;

  if (!message.content.startsWith(message.prefix)) return;

  const args = message.content.substring(message.prefix.length).split(" ");
  const command = args[0];

  let modUsers = await client.db.get(`guilds.guild_${message.guild.id}.users.mods`);
  let modRoles = await client.db.get(`guilds.guild_${message.guild.id}.roles.mods`);

  let ownerID = message.guild.member(guild.owner).user.id;
  let author = message.author;
  let authorID = author.id;

  const roleFound = modRoles.some((r) => author.roles.cache.includes(r));

  const authorIsOwner = authorID == ownerID;
  const authorIsMod = modUsers.includes(authorID) || roleFound;

  let access = false;

  if (command.permission) {
    if (authorIsOwner && command.permission == "owner") access = true;
    else if ((authorIsMod || authorIsOwner) && command.permission == "mod") access = true;
  } else access = true;

  if (!access) return tempMsg.send(message, "Missing permissions for this command!");

  if (!client.commands.get(command)) return message.delete();

  client.commands.get(command).execute(client, message, args);
  client.tempMsg.delete(message);
};
