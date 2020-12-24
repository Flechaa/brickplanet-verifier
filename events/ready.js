const guilds = require('../models/guilds');
module.exports = async (client, guild) => {  
  console.log('The bot ' + client.user.tag + ' successfully logged in.')
  console.log('In ' + client.guilds.size + ' guilds.')
  console.log('Servers:')
  client.guilds.forEach(guild => {
  console.log(` - ${guild.name}`);
  });
  client.user.setActivity(`${client.users.size} users in ${client.guilds.size} guilds`, { type: 'LISTENING'});
  await client.guilds.keyArray().forEach(id => {
  guilds.findOne({guild_id: id}, (err, guild) => {
  if (err) console.log(err)
  if (!guild) {
  let newGuild = new guilds({guild_id: id, verifychannel: '0', verifyrole: '0', whitelisted: 'false'})
  return newGuild.save().catch(err => console.log(err))
  }
  });
  });
}