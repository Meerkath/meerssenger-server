const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.body = Object.assign(req.body, user);
    next();
  })
}

const refreshToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      res.sendStatus(401);
    }
    User.findById(data.user._id, (err, user) => {
      if(err) 
        throw new Error(err);
      if(user){
        res.send({accessToken: generateAccessToken(user)});
      }
    })
  });
};


const generateAccessToken = (user) => {
  return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1y'});
} 

const generateRefreshToken = (user) => {
  return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}


module.exports = {
  generateAccessToken,
  authenticateToken,
  refreshToken,
  generateRefreshToken,
}