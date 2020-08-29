const tempMsg = require("../utils/tempMsg");

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  message.prefix = client.db.get(`guilds.guild_${message.guild.id}.prefix`) || client.config.PREFIX;

  if (!message.content.startsWith(message.prefix)) return;

  const args = message.content.substring(message.prefix.length).split(" ");
  const command = client.commands.get(args[0]);
  if (!command) return message.delete();

  let modUsers = await client.db.get(`guilds.guild_${message.guild.id}.users.mods`);
  let modRoles = await client.db.get(`guilds.guild_${message.guild.id}.roles.mods`);

  let ownerID = message.guild.member(message.guild.owner).user.id;
  let author = message.guild.member(message.author);
  let authorID = author.id;

  const roleFound = modRoles ? modRoles.some((r) => author._roles.includes(r)) : null;
  const authorIsOwner = authorID == ownerID;
  const authorIsMod = modUsers ? modUsers.includes(authorID) || roleFound : roleFound;

  let access = false;

  if (command.permission) {
    if (authorIsOwner && command.permission == "owner") access = true;
    else if ((authorIsMod || authorIsOwner) && command.permission == "mod") access = true;
  } else access = true;

  if (!access) return tempMsg.send(message, "Missing permissions for this command!");

  command.execute(client, message, args);
  client.tempMsg.delete(message);
};
