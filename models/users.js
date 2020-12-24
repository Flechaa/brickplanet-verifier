const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  id: String,
  username: String,
  user_id: String,
  guild_id: String,
  code: String,
  verified: String,
  verifytime: Date
});

module.exports = mongoose.model('users', usersSchema);