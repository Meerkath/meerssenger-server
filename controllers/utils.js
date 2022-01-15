const sha = require('sha.js');

function hashPassword(pass){
  return sha('sha256').update(pass).digest('hex');
}

module.exports = {
  hashPassword
}