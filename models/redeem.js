const mongoose = require('mongoose');

const redeemSchema = mongoose.Schema({
  code: String,
  redeemed: String,
  rguild: String,
  created: Date,
  expires: Date
})

module.exports = mongoose.model('redeem', redeemSchema)