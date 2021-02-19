import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default User = mongoose.model('User', Schema({
  chatId: String,
  token: String
}));

