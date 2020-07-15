module.exports = (client, member) => {
  const defaultRole = member.guild.roles.cache.find(
    (role) => role.name === client.config.DEFAULT_ROLE
  );
  const welcomeChannel = member.guild.channels.cache.find(
    (channel) => channel.id == client.config.WELCOME_CHANNEL_ID
  );

  if (!defaultRole)
    return console.error(`Error: ${client.config.DEFAULT_ROLE} role not exists in guild!`);
  if (!welcomeChannel)
    return console.error(
      `Error: ${client.config.WELCOME_CHANNEL_ID} channel id not exists in guild!`
    );

  member.roles.add(defaultRole);

  client.storeUserData(member.id);
};
