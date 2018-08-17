/*
 * Helpers for various tasks
 *
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Container for al lthe Helpers
var helpers = {};


// Create a SHA256 hash
helpers.hash = function(str) {
  if(typeof(str)=='string' && str.length > 0) {
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return(false);
  }
};

// Create Object passed as string
helpers.parsedJsonToObject = function(str){
  try{
    var obj = str.JSON.parse(srt);
    return obj;
  }catch(e){
    return{};
  }

};

 // expoet the module
 module.exports = helpers;
