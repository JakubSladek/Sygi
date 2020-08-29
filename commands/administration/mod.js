const Discord = require("discord.js");

module.exports = {
  name: "mod",
  permission: "owner",
  description: "manage guild mods",
  async execute(client, message, args) {
    try {
      const embedHelp = new Discord.MessageEmbed()
        .setAuthor(`Command: ${message.prefix}${this.name}`)
        .setDescription(
          `
          **Description:** Manage guild ${this.name}s.
          **Get ${this.name} list:** ${message.prefix}${this.name} list

          **Add ${this.name} user:** ${message.prefix}${this.name} add @user
          **Add ${this.name} role:** ${message.prefix}${this.name} add @role

          **Remove ${this.name} user:** ${message.prefix}${this.name} remove @user
          **Remove ${this.name} role:** ${message.prefix}${this.name} remove @role
          `
        )
        .setColor("#0f0f0f");

      const params = ["list", "add", "remove"];
      const wrongCommand = () => client.tempMsg.send(message, embedHelp);

      let roleMention = message.mentions.roles.first() || null;
      let userMention = message.mentions.users.first() || null;

      let roleMentionID = roleMention ? roleMention.id : null;
      let userMentionID = userMention ? userMention.id : null;

      if (!args[1] || !params.includes(args[1]) || args.length > 3) return wrongCommand();
      else if (args[1] == params[0] && args.length > 2) return wrongCommand();
      else if ((args[1] == params[1] || args[1] == params[2]) && !roleMention && !userMention) return wrongCommand();

      const param = args[1];

      let users = await client.db.get(`guilds.guild_${message.guild.id}.users.${this.name}s`);
      let roles = await client.db.get(`guilds.guild_${message.guild.id}.roles.${this.name}s`);

      if (param == params[0]) {
        let usersText = users && users.length ? users.map((u) => message.guild.members.cache.get(u)).join(" ") : `There are not set any ${this.name} users right now.`;
        let rolesText = roles && roles.length ? roles.map((r) => message.guild.roles.cache.get(r)).join(" ") : `There are not set any ${this.name} roles right now.`;

        const embedList = new Discord.MessageEmbed()
          .setDescription(
            `
            **${this.name.charAt(0).toUpperCase() + this.name.slice(1)} users**:
            ${usersText}
            
            **${this.name.charAt(0).toUpperCase() + this.name.slice(1)} groups**:
            ${rolesText}
            `
          )
          .setColor("#0f0f0f");

        client.tempMsg.send(message, embedList);
      } else if (param == params[1]) {
        if (userMention) {
          if (users && users.includes(userMentionID)) return client.tempMsg.send(message, `${userMention} is already ${this.name}!`);

          client.db.push(`guilds.guild_${message.guild.id}.users.${this.name}s`, userMentionID);

          client.tempMsg.send(message, `Succesfully set ${userMention} as your new ${this.name}.`);
          return;
        }

        if (roles && roles.includes(roleMentionID)) return client.tempMsg.send(message, `${roleMention} is already set as ${this.name} role!`);

        client.db.push(`guilds.guild_${message.guild.id}.roles.${this.name}s`, roleMentionID);

        client.tempMsg.send(message, `Succesfully set ${roleMention} as your new ${this.name} role.`);
        return;
      } else if (param == params[2]) {
        if (userMention) {
          if (!users.includes(userMentionID)) return client.tempMsg.send(message, `${userMention} is not a ${this.name}!`);

          let index = users.indexOf(userMentionID);
          users.splice(index, 1);

          client.db.set(`guilds.guild_${message.guild.id}.users.${this.name}s`, users);

          client.tempMsg.send(message, `Succesfully removed ${this.name} permissions from ${userMention}!`);
          return;
        }
        console.log(roles);
        if (!roles.includes(roleMentionID)) return client.tempMsg.send(message, `${roleMention} is not a ${this.name} role.`);

        let index = roles.indexOf(roleMentionID);
        roles.splice(index, 1);
        console.log(roles);

        client.db.set(`guilds.guild_${message.guild.id}.roles.${this.name}s`, roles);

        client.tempMsg.send(message, `Succesfully removed ${this.name} permissions from ${roleMention}.`);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  },
};
