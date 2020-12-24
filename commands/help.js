const Discord = require('discord.js');
const config = require('../config.json');
module.exports.run = async (client, message, args) => {
 let helpEmbed = new Discord.RichEmbed()
 .setColor('RANDOM')
 .setTimestamp()
 .setFooter(client.user.username, client.user.avatarURL)
 if (args[0]) {
  let commandArgs = args[0]
  client.command = client.commands.get(client.aliases.get(commandArgs) || commandArgs)
  if (client.command) {
    helpEmbed.setTitle('Help for ' + client.command.help.name.slice(0, 1).toUpperCase() + client.command.help.name.slice(1) + ' command.')
    helpEmbed.setDescription('``{} means optional, <> means required.``\n\n**Aliases:** `' + client.command.help.name + client.command.help.aliases.join(', ') + '`\n**Usage:** `' + config.prefix + client.command.help.name + ' ' + client.command.help.usage + '`')
    message.channel.send(helpEmbed)
  }
  if (!client.command) {
   helpEmbed.setColor('RED')
   helpEmbed.setTitle(':x: Error')
   helpEmbed.setDescription('Command not found.')
   message.channel.send(helpEmbed) 
  }
 } else {
  let commands = client.commands.map(x => x.help.name)
  helpEmbed.setTitle('List of all the commands.')
  helpEmbed.setDescription(commands.join(', '))
  message.channel.send(helpEmbed)
 }
}

module.exports.help = {
  name: "help",
  aliases: ['h'],
  usage: ['<command>']
}