const guilds = require('../models/guilds');
const config = require('../config.json');
module.exports = async (client, message) => {
 let prefix = config.prefix;
 if(message.author.bot) return;
 if(message.channel.type === "dm") return;
 guilds.findOne({guild_id: message.guild.id}, (err, guild) => {
 if (!message.content.startsWith(prefix)) return;
 const args = message.content.slice(prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
 const commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!commandfile) return;
  if (guild.whitelisted === 'false') {
  if (command !== 'redeem') return message.channel.send('This guild is not whitelisted.')
  }
  commandfile.run(client, message, args).catch((err) => {
  console.error(err)
  message.channel.send('An error has occurred.```' + err + '```');
  });
 });
}