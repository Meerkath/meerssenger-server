const Message = require('../models/Message');
const ObjectId = require("mongoose").Types.ObjectId;

const getLastMessage = (req, res) => {
  Message.findOne({
    $or:
    [ 
      { 
        $and: 
        [ 
          { senderId: new ObjectId(req.body.user._id) }, 
          { recipientId: new ObjectId(req.params.userId) } 
        ]
      },
      {
        $and: 
        [
          { recipientId: new ObjectId(req.body.user._id) },
          { senderId: new ObjectId(req.params.userId) }
        ]
      } 
    ]
  }
  ).sort({'date': -1}).then((lastMessage) => {
    if(!lastMessage)
      res.sendStatus(404);
    res.send(lastMessage);
  })
}

const getAllMessages = (req, res) => {
  Message.find({
    $or:
    [ 
      { 
        $and: 
        [ 
          { senderId: new ObjectId(req.body.user._id) }, 
          { recipientId: new ObjectId(req.params.userId) } 
        ]
      },
      {
        $and: 
        [
          { recipientId: new ObjectId(req.body.user._id) },
          { senderId: new ObjectId(req.params.userId) }
        ]
      } 
    ]
  }).then((allMessages) => {
    if(!allMessages)
      res.sendStatus(404);
    res.send(allMessages);
  })
}

const sendMessage = (req, res) => {
  let message = new Message(req.body.message);
  message.recipientId = req.params.userId;
  message.senderId = req.body.user._id;
  message._id = new ObjectId();
  message.save().then(message => {
    if(!message)
      res.sendStatus(300);
    res.status = 201;
    res.send(message);
  });
}

module.exports = {
  getLastMessage,
  getAllMessages,
  sendMessage
}