const Discord = require('discord.js');
const config = require('../config.json');
const superagent = require('superagent');
const users = require('../models/users');
const guilds = require('../models/guilds');
module.exports.run = async (client, message, args) => {
guilds.findOne({guild_id: message.guild.id}, async (err, guild) => {
let verifyc = message.guild.channels.get(guild.verifychannel)
   if (!verifyc) return message.channel.send('No verify channel found.')
   if (message.channel.id !== guild.verifychannel) return message.channel.send('You can\'t verify here.')
   function code(length) {
     let result = '';
     let numbers = '123456789';
     let numbersLength = numbers.length;
     for (let i = 0; i < length; i++) {
     result += numbers.charAt(Math.floor(Math.random() * numbersLength));
     }
     return result
   }
   let verifyEmbed = new Discord.RichEmbed()
   .setColor('RANDOM')
   .setAuthor(message.author.tag, message.author.avatarURL)
   .setFooter(client.user.username, client.user.avatarURL)
   .setTimestamp()
   if (args[0]) {
   let {body} = await superagent
   .get(`https://www.brickplanet.com/web-api/users/get-user/${args[0]}`).catch(err => message.channel.send('Something went wrong.'))
   if (!body) return message.channel.send('Looks like BrickPlanet is offline.')
   if (body.status) return message.channel.send('That user doesn\'t exist.')
   users.findOne({id: body.ID, guild_id: message.guild.id, verified: 'true'}, (err, uuser) => {
   users.findOne({user_id: message.author.id, guild_id: message.guild.id}, async (err, user) => {
   if (!user) {
    if (uuser) return message.channel.send('Theres an account already linked with that user.')
    let code2 = 'BPV' + code(7)
    let newUser = new users({id: body.ID, username: body.Username, user_id: message.author.id, guild_id: message.guild.id, code: code2, verified: 'false', verifytime: new Date()});
    newUser.save().catch(err => message.channel.send('Something went wrong while verifying.'))
    verifyEmbed.setTitle('Verifying ' + body.Username)
    verifyEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
    verifyEmbed.setDescription('Use the code **' + code2 + '** to verify **[' + body.Username + '](https://www.brickplanet.com/users/' + body.Username + ')**.\nGo to your [settings page](https://www.brickplanet.com/account/settings/) to change your **profile blurb** or on the [dashboard](https://www.brickplanet.com/account/dashboard) to change your **status**.\n\nWhen you are done type `' + config.prefix + 'verify ' + body.Username + '` to complete the verification.')
    message.channel.send('Hello, ' + message.author + ' please use the following code on your profile blurb or status.', verifyEmbed)
   }
   if (user) {
   if (body.ID == user.id) {
   if (user.verified === 'true') {
   let author = await message.guild.fetchMember(message.member)
   await author.setNickname(body.Username).catch(err => message.channel.send('Error while changing nickname.'))
   let role = message.guild.roles.get(guild.verifyrole)
   if (!role) return message.channel.send('No verified role found.')
   author.addRole(role).catch(err => message.channel.send('Could\'t give the role to user.'))
   await message.channel.send('You are already verified.')
   return;
   }
   if (uuser) return message.channel.send('Theres an account already linked with that user.')
   try {
   if (body.About == user.code || body.Status == user.code || body.About.includes(user.code) || body.Status.includes(user.code)) {
   verifyEmbed.setColor('GREEN')
   verifyEmbed.setTitle(':white_check_mark: Success')
   verifyEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
   verifyEmbed.setDescription('You are verified as **[' + body.Username + '](https://www.brickplanet.com/users/' + body.Username + ')**.')
   message.channel.send(verifyEmbed)
   user.verified = 'true';
   user.save().catch(err => message.channel.send('Something went wrong while verifying.'))
   let author = await message.guild.fetchMember(message.member)
   await author.setNickname(body.Username).catch(err => message.channel.send('Error while changing nickname.'))
   let role = message.guild.roles.get(guild.verifyrole)
   if (!role) return message.channel.send('No verified role found.')
   await author.addRole(role).catch(err => message.channel.send('Could\'t give the role to user.'))
   } else {
   verifyEmbed.setColor('RED')
   verifyEmbed.setTitle(':x: Error')
   verifyEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
   verifyEmbed.setDescription('The verification wasn\'t completed due an invalid code inserted or no code inserted.\n\nThe currently code is **' + user.code + '**, please try again.')
   message.channel.send(verifyEmbed)
   }
   } catch (err) {
    verifyEmbed.setColor('RED')
    verifyEmbed.setTitle(':x: Error')
    verifyEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
    verifyEmbed.setDescription('The verification wasn\'t completed due an invalid code inserted or no code inserted.\n\nThe currently code is **' + user.code + '**, please try again.')
    message.channel.send(verifyEmbed)
    return;
   }
   }
   else {
   if (uuser) return message.channel.send('Theres an account already linked with that user.')
   let code2 = 'BPV' + code(7);
   user.id = body.ID
   user.username = body.Username
   user.code = code2
   user.verified = 'false'
   user.verifytime = new Date()
   user.save().catch(err => message.channel.send('Something went wrong while verifying.'))
   verifyEmbed.setTitle('Verifying ' + body.Username)
   verifyEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
   verifyEmbed.setDescription('Use the code **' + code2 + '** to verify **[' + body.Username + '](https://www.brickplanet.com/users/' + body.Username + ')**.\nGo to your [settings page](https://www.brickplanet.com/account/settings/) to change your **profile blurb** or on the [dashboard](https://www.brickplanet.com/account/dashboard) to change your **status**.\n\nWhen you are done type `' + config.prefix + 'verify ' + body.Username + '` to complete the verification.')
   message.channel.send('Hello, ' + message.author + ' please use the following code on your profile blurb or status.', verifyEmbed);
   }
   }
   });
   });
  }
  else {
  verifyEmbed.setColor('RED')
  verifyEmbed.setTitle(':x: Error')
  verifyEmbed.setDescription('Please provide your BrickPlanet username. e.g. `' + config.prefix + 'verify Flechaa`')
  message.channel.send(verifyEmbed)
  }
});
}

module.exports.help = {
   name: "verify", 
   aliases: [],
   usage: ['<username>']
}