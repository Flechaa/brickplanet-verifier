const Discord = require('discord.js');
const config = require('../config.json');
const redeem = require('../models/redeem');
module.exports.run = async (client, message, args) => {
if (message.author.id !== config.flechaa) return message.channel.send('Only the bot owner can use this command.')
function code(length) {
  let result = '';
  let numbers = '123456789';
  let numbersLength = numbers.length;
  for (let i = 0; i < length; i++) {
  result += numbers.charAt(Math.floor(Math.random() * numbersLength));
  }
  return result
}
let code2 = 'R' + code(9)
let newKey = new redeem({code: code2, redeemed: 'false', rguild: '0', created: new Date(), expires: new Date()});
newKey.save().catch(err => message.channel.send('Couldn\'t generate a code.'))
message.channel.send('Regenerated the code')
message.author.send('The code is ' + code2)
}

module.exports.help = {
  name: "newcode",
  aliases: [],
  usage: []
}