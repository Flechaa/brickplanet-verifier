module.exports = async (client, member) => {
  client.user.setActivity(`${client.users.size} users in ${client.guilds.size} guilds`, { type: 'LISTENING'});
}