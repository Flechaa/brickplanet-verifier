const Discord = require('discord.js');
const guilds = require('../models/guilds');
const redeem = require('../models/redeem');
module.exports.run = async (client, message, args) => {
guilds.findOne({guild_id: message.guild.id}, (err, guild) => {
let redeemEmbed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTimestamp()
.setFooter(client.user.username, client.user.avatarURL)
if (guild.whitelisted === 'true') return message.channel.send('This guild is already whitelisted.');
if (args[0]) {
redeem.findOne({code: args[0]}, (err, redeem) => {
if (redeem) {
if (redeem.redeemed === 'true') return message.channel.send('That code was already claimed.')
redeem.rguild = message.guild.id;
redeem.redeemed = 'true';
guild.whitelisted = 'true';
redeem.save().catch(err => console.log(err))
guild.save().catch(err => console.log(err))
redeemEmbed.setTitle(':white_check_mark: Success')
redeemEmbed.setDescription('You successfully whitelisted **' + message.guild.name + '**.')
message.channel.send(redeemEmbed)
} else {
redeemEmbed.setColor('RED')
redeemEmbed.setTitle(':x: Error')
redeemEmbed.setDescription('Invalid Code.')
message.channel.send(redeemEmbed)
}
});
} else {
redeemEmbed.setColor('RED')
redeemEmbed.setTitle(':x: Error')
redeemEmbed.setDescription('Arguments missing.')
message.channel.send(redeemEmbed)
}
});
}

module.exports.help = {
  name: "redeem",
  aliases: [],
  usage: ['{code}']
}