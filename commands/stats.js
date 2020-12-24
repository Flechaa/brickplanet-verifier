const Discord = require('discord.js');
const users = require('../models/users');
const guilds = require('../models/guilds');
const moment = require('moment');
module.exports.run = async (client, message, args) => {
guilds.findOne({guild_id: message.guild.id}, async (err, guild) => {
users.find({}).exec((err, user) => {
   users.find({guild_id: message.guild.id}).exec((err, tuser) => {
   users.find({guild_id: message.guild.id, verified: 'true'}, ['id', 'username', 'user_id', 'guild_id', 'code', 'verified', 'verifytime']).exec((err, vuser) => {
   users.find({verified: 'true'}, ['id', 'username', 'user_id', 'guild_id', 'code', 'verified', 'verifytime']).exec((err, tvuser) => {
   users.find({guild_id: message.guild.id, verified: 'false'}, ['id', 'username', 'user_id', 'guild_id', 'code', 'verified', 'verifytime']).exec((err, uuser) => {
   users.find({verified: 'false'}, ['id', 'username', 'user_id', 'guild_id', 'code', 'verified', 'verifytime']).exec((err, tuuser) => {
    let joined = moment(message.guild.member(client.user).joinedAt).format('MMMM Do YYYY, h:mmA');
    let statsEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(client.user.username + '\'s Stats')
    .addField('Total Registed Users', user.length)
    .addField('Registed Users in this guild', tuser.length)
    .addField('Total Verified Users', tvuser.length)
    .addField('Verified Users in this guild', vuser.length)
    .addField('Total Unverified Users', tuuser.length)
    .addField('Unverified Users in this guild', uuser.length)
    .addField('Joined this guild', joined)
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL)
    message.channel.send(statsEmbed)
    });
    });
    });
    });
    });
    });
});
}

module.exports.help = {
   name: "stats", 
   aliases: [],
   usage: []
}