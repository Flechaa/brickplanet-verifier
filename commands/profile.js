const Discord = require('discord.js');
const users = require('../models/users');
const superagent = require('superagent');
const moment = require('moment');
module.exports.run = async (client, message, args) => {
users.findOne({guild_id: message.guild.id, user_id: message.author.id}, async (err, user) => {
 let profileEmbed = new Discord.RichEmbed()
 .setColor('RANDOM')
 .setTimestamp()
 .setFooter(client.user.username, client.user.avatarURL)
 if (message.mentions.members.first()) {
 let user = message.mentions.users.first();
 users.findOne({guild_id: message.guild.id, user_id: user.id}, async (err, guser) => {
 if (!guser) return message.channel.send('No account is linked with the provided user.')
 if (guser) {
 let verified = '';
 if (guser.verified === 'true') verified += ('Yes (' + user + ')')
 if (guser.verified === 'false') verified += ('No')
 let {body} = await superagent
 .get(`https://www.brickplanet.com/web-api/users/get-user/${guser.id}`).catch(err => message.channel.send('Something went wrong.'))
 if (!body) return message.channel.send('Looks like BrickPlanet is offline.');
 let joindate = moment.unix(body.JoinedAt).format('MMMM Do, YYYY');
 let accage = moment.unix(body.JoinedAt).fromNow(true)
 let lastseen = moment.unix(body.LastSeen).startOf('seconds').fromNow();
 let verify = moment(guser.verifytime).format('MMM Do YYYY, h:mmA');
 profileEmbed.setAuthor(user.tag, user.avatarURL)
 profileEmbed.setTitle(body.Username + '\'s profile')
 profileEmbed.setURL('https://www.brickplanet.com/users/' + body.Username)
 profileEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
 if (guser.verified === 'false') profileEmbed.setDescription('**Verified:** ' + verified + '\n**Joined:** ' + joindate + '\n**Account Age:** ' + accage + ' old\n**Last seen ' + lastseen + '**')
 else profileEmbed.setDescription('**Verified:** ' + verified + '\n**Joined:** ' + joindate + '\n**Account Age:** ' + accage + ' old\n**Verified since ' + verify + '**\n**Last seen ' + lastseen + '**')
 message.channel.send(profileEmbed)
 }
 });
 }
 if (!message.mentions.members.first()) {
 if (args[0]) {
 let {body} = await superagent
 .get(`https://www.brickplanet.com/web-api/users/get-user/${args[0]}`).catch(err => message.channel.send('Something went wrong.'))
 if (!body) return message.channel.send('Looks like BrickPlanet is offline.')
 if (body.status) return message.channel.send('That user doesn\'t exist.');
 users.findOne({guild_id: message.guild.id, id: body.ID, verified: 'true'}, (err, geuser) => {
 if (geuser) {
 if (body.Username !== geuser.username) {
 geuser.username = body.Username
 geuser.save().catch(err => console.log(err))
 }
 let verified = '';
 let user = client.users.get(geuser.user_id) || 'undefined';
 if (geuser.verified === 'true') verified += ('Yes (' + user + ')')
 if (geuser.verified === 'false') verified += ('No')
 let joindate = moment.unix(body.JoinedAt).format('MMMM Do, YYYY');
 let lastseen = moment.unix(body.LastSeen).startOf('seconds').fromNow();
 let accage = moment.unix(body.JoinedAt).fromNow(true);
 let verify = moment(geuser.verifytime).format('MMM Do YYYY, h:mmA');
 profileEmbed.setAuthor(user.tag, user.avatarURL)
 profileEmbed.setTitle(body.Username + '\'s profile')
 profileEmbed.setURL('https://www.brickplanet.com/users/' + body.Username)
 profileEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
 profileEmbed.setDescription('**Verified:** ' + verified + '\n**Joined:** ' + joindate + '\n**Account Age:** ' + accage + ' old\n**Verified since ' + verify + '**\n**Last seen ' + lastseen + '**')
 message.channel.send(profileEmbed)
 }
 if (!geuser) {
 let joindate = moment.unix(body.JoinedAt).format('MMMM Do, YYYY');
 let accage = moment.unix(body.JoinedAt).fromNow(true);
 let lastseen = moment.unix(body.LastSeen).startOf('seconds').fromNow();
 profileEmbed.setTitle(body.Username + '\'s profile')
 profileEmbed.setURL('https://www.brickplanet.com/users/' + body.Username)
 profileEmbed.setThumbnail('https://cdn.brickplanet.com/' + body.AvatarImage + '.png')
 profileEmbed.setDescription('**Verified:** No\n**Joined:** ' + joindate + '\n**Account Age:** ' + accage + ' old\n**Last seen ' + lastseen + '**')
 message.channel.send(profileEmbed)
 }
 });
 }
 }
 });
}

module.exports.help = {
   name: "profile", 
   aliases: [],
   usage: ['<user> or <username>']
}