const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const User = mongoose.model('User', Schema({
  chatId: String,
  token: String
}));

module.exports = User;