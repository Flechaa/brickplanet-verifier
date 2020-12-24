const mongoose = require('mongoose')

const guildsSchema = mongoose.Schema({
  guild_id: String,
  verifychannel: String,
  verifyrole: String,
  whitelisted: String
});

module.exports = mongoose.model('guilds', guildsSchema)