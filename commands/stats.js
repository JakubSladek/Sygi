const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "stats",
  description: "get bot stats",
  execute(client, message, args) {
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");
    message.channel
      .send(
        `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size ? client.users.size.toLocaleString() : "IN NEXT UPDATE"}
• Servers    :: ${client.guilds.size ? client.users.size.toLocaleString() : "IN NEXT UPDATE"}
• Channels   :: ${client.channels.size ? client.users.size.toLocaleString() : "IN NEXT UPDATE"}
• Discord.js :: v${version}
• Node       :: ${process.version}`,
        { code: "asciidoc" }
      )
      .then((msg) => {
        client.tempMsg.delete(msg);
      });
  },
};
