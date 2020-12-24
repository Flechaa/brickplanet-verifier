const guilds = require('../models/guilds');
module.exports = async (client, guild) => {
  client.user.setActivity(`${client.users.size} users in ${client.guilds.size} guilds`, { type: 'LISTENING'});
  await guilds.findOne({guild_id: guild.id}, (err, g) => {
  if (err) console.log(err)
  if (!g) {
  let newGuild = new guilds({guild_id: guild.id, verifychannel: '0', verifyrole: '0', whitelisted: 'false'});
  return newGuild.save().catch(err => console.log(err))
  }
  });
}