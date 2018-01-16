// Part of https://github.com/chris-rock/node-crypto-examples

// Nodejs encryption with CTR
var algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

//var generator = require('generate-password');
 
//var password = generator.generate({
  //  length: 10,
    //numbers: true
//});
var crypto = require('crypto');
module.exports = {
encrypt: function (text) {
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
},
 
decrypt: function (text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
};