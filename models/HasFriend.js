const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const HasFriendSchema = new mongoose.Schema({
  _id: ObjectId,
  userId: ObjectId,
  friendWith: ObjectId
});
const HasFriend = mongoose.model('hasfriend', HasFriendSchema);

module.exports = HasFriend;