const HasFriend = require('../models/HasFriend');
const User = require('../models/User');
const ObjectId = require("mongoose").Types.ObjectId;
const { Error } = require('mongoose');
const utils = require("./utils");
const auth = require("./auth");
require('dotenv').config();

const getFriends = (req, res) => {
  HasFriend.find({
      $or:
      [ 
        { userId: new ObjectId(req.body.user._id) },
        { friendWith: new ObjectId(req.body.user._id) } 
      ]
    }, (err, hasFriendList) => {
    if (err)
      throw new Error(err);
    const friendsIdList = [];
    hasFriendList.forEach(el => {
      if(el.friendWith.toString() === req.body.user._id)
        friendsIdList.push(el.userId)
      else
        friendsIdList.push(el.friendWith);
    });
    User.find({_id: { $in: friendsIdList }}, { password: 0 }, (err, friends) => {
      if (err)
        throw new Error(err);
      res.send(friends);
    })
  });
}

const createUser = (req, res) => {
  res.status(400);
  if(!req.body.firstName){ res.send("Please provide firstName attribute."); return; }
  if(!req.body.lastName){ res.send("Please provide lastName attribute."); return; }
  if(!req.body.email){ res.send("Please provide email attribute."); return; }
  if(!req.body.password){ res.send("Please provide password attribute."); return; }
  if(!req.body.userName){ res.send("Please provide userName attribute."); return; }
  const user = new User(req.body);

  User.findOne(
  {
      "$or":
      [
        { userName :  user.userName },
        { email  :  user.email }
      ]
  },(err, foundUser) => {
    if(err)
      throw new Error(err);
    if(foundUser){
      if(user.userName == foundUser.userName){
        res.status(403).send("Username already exists.");
        return;
      }
      else{
        res.status(403).send("Email already exists.");
        return;
      }
    }
    user._id = ObjectId();
    user.password = utils.hashPassword(user.password);    
    user.save((err, user) => {
      if(err)
        throw new Error(err);
      res.status(201).send({user, accessToken: auth.generateAccessToken(user)});  
    });
  })
}

const login = (req, res) => {
  if(!req.body.emailOrUserName){ res.status(400).send("Please provide emailOrUserName attribute."); return; }
  if(!req.body.password){ res.status(400).send("Please provide password attribute."); return; }
  User.findOne(
    {
      "$or":
      [
        { userName :  req.body.emailOrUserName },
        { email  :  req.body.emailOrUserName }
      ]
    },
    (err, user) => {
      if(err)
        throw new Error(err);
      if(!user){
        res.status(404).send("This email or username doesn't exists.");
        return;
      }
      if(utils.hashPassword(req.body.password) === user.password){
        user.password = undefined;
        res.status(200).send({user, accessToken: auth.generateAccessToken(user), refreshToken: auth.generateRefreshToken(user)});
      }
      else{
        res.status(403).send("Incorrect password.");
      }
    }
  );
}

const isFriend = (req, res, next) => {
  HasFriend.findOne(
    {
      $or:
      [ 
        { 
          $and: 
          [ 
            { userId: new ObjectId(req.body.user._id) }, 
            { friendWith: new ObjectId(req.params.userId) } 
          ]
        },
        {
          $and: 
          [
            { friendWith: new ObjectId(req.body.user._id) },
            { userId: new ObjectId(req.params.userId) }
          ]
        } 
      ]
    }
    ).then((hasFriend) => {
      if(!hasFriend){
        res.sendStatus(403);
        return;
      }
      next();
    });
}

module.exports = {
  getFriends,
  createUser,
  login,
  isFriend
}