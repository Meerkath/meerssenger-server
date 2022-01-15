const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  _id: ObjectId,
  lastName: String,
  firstName: String,
  email: String,
  userName: String,
  password: String,
});
const User = mongoose.model('user', UserSchema);

module.exports = User;