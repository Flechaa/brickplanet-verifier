const Discord = require('discord.js');
const users = require('../models/users');
const superagent = require('superagent');
const guilds = require('../models/guilds');
module.exports.run = async (client, message, args) => {
guilds.findOne({guild_id: message.guild.id}, (err, guild) => {
if (message.mentions.members.first()) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You need `MANAGE_MESSAGES` permissions to update other users.')
    let member = message.mentions.members.first(); 
   users.findOne({guild_id: message.guild.id, user_id: member.user.id}, async (err, user) => {
    if (user.verified === 'false') return message.channel.send('This user is not verified.')
    let {body} = await superagent
    .get(`https://www.brickplanet.com/web-api/users/get-user/${user.id}`).catch(err => message.channel.send('Something went wrong.'))
    if (!body) return message.channel.send('Looks like BrickPlanet is offline.')
    if (body.status) return message.channel.send('That user doesn\'t exist.')
   let checkr = member.roles.some(x => x.id === guild.verifyrole)
   let role = message.guild.roles.get(guild.verifyrole)
   if (!role) message.channel.send('No role found.')
   if (message.member.displayName !== body.Username) {
     member.setNickname(body.Username).catch(err => message.channel.send('Couldn\'t update the nickname.'))
     user.username = body.Username;
     user.save().catch(err => message.channel.send('Something went wrong while updating user.'))
     message.channel.send('Updated the nickname.')
   }
   if (!checkr) {
     member.addRole(role).catch(err => message.channel.send('Could\'t give the role.'))
     message.channel.send('Updated the role.')
   }
   });
  } else {
   users.findOne({guild_id: message.guild.id, user_id: message.author.id}, async (err, user) => {
   if (user.verified === 'false') return message.reply('You are not verified.')
   let {body} = await superagent
   .get(`https://www.brickplanet.com/web-api/users/get-user/${user.id}`).catch(err => message.channel.send('Something went wrong.'))
   if (!body) return message.channel.send('Looks like BrickPlanet is offline.')
   if (body.status) return message.channel.send('That user doesn\'t exist.')
   let checkr = message.member.roles.some(x => x.id === guild.verifyrole)
   let role = message.guild.roles.get(guild.verifyrole)
   if (!role) message.channel.send('No role found.')
   if (message.member.displayName !== body.Username) {
   message.member.setNickname(body.Username).catch(err => message.channel.send('Couldn\'t update the nickname.'))
   user.username = body.Username
   user.save().catch(err => message.channel.send('Couldn\'t give the role.'))
   message.channel.send('Updated the nickname.')
   }
   if (!checkr) {
   message.member.addRole(role).catch(err => message.channel.send('Couldn\'t give the role.'))
   message.channel.send('Updated the role.')
   }
   });
  }
});
}

module.exports.help = {
   name: "update", 
   aliases: [],
   usage: ['{user}']
}