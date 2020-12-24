module.exports = async (client, guild) => {
  client.user.setActivity(`${client.users.size} users in ${client.guilds.size} guilds`, { type: 'LISTENING'});
}