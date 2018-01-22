// Nodejs encryption with CTR
// made based on https://www.npmjs.com/package/aes-js
var algorithm = 'aes-256-ctr';

var crypto = require('crypto');

var key;

const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

module.exports = {
encrypt: function (text) {
	key = crypto.randomBytes(32);
	console.log(key);
	var cipher = crypto.createCipher(algorithm,key);
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	client.connect();
	var queryText = 'INSERT INTO keys(key) VALUES($1) RETURNING index'
	client.query(queryText, [key], function(err, result) {
	  if(err) {throw err} //handle error
	  else {
	    var newlyCreatedUserId = result.rows[0].index;
	    console.log(newlyCreatedUserId);
	  }
	});
	return crypted;
},
 
decrypt: function (text){
	var decipher = crypto.createDecipher(algorithm,key);
	var dec = decipher.update(text,'hex','utf8');
	dec += decipher.final('utf8');
	return dec;
}
};
