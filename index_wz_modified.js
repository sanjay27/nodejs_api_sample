/*
* Primary file for the API
*
*/

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var _data = require('./lib/data');

// TESTING
// @TODO delete this
//console.log(_data);
// WRITE
// _data.create('test','newFile',{'foo' : 'bar'},function(err){
// 	console.log('this was the error',err);
//READ
// _data.read('test','newFile',function(err,data){
// 	console.log('this was the error',err, ' and this was the data ', data);	
//UPDATE
// _data.update('test','newFile',{'fizz':'buzz'},function(err){
// 	console.log('this was the error',err);	
//DELETE
_data.delete('test','newFile',function(err){
	console.log('this was the error',err);	
});


// Instantiate HTTP Server - The Server should response to all the Requests with a string
var httpServer = http.createServer(function(req,res){
	unifiedServer(req, res);
});

// Start the HTTP Server and Listen on Port 3000
httpServer.listen(config.httpPort, function() {
	console.log("The Server is Listening on port "+config.httpPort+" in "+config.envName+" mode");
});


// Instantiate HTTPS Server
var httpsServerOptions = {
	'key' : fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem')
}

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
	unifiedServer(req, res);
});

// Start HTTPS Server
httpsServer.listen(config.httpsPort, function() {
	console.log("The Server is Listening on port "+config.httpsPort+" in "+config.envName+" mode");
});


var unifiedServer = function(req, res) {
	// Get the URL and Parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path from the url
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an OBJECT
	var queryStringObject = parsedUrl.query;

	// Get the Method of Request
	var method = req.method.toUpperCase();

	// Get the Headers as an Object
	var headers = req.headers;


	// Get the Payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();

		//
		var chosenhandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct the data object to e send to the handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

		//Route the Request to the handler speciefie in the router
		chosenhandler(data, function(statusCode,payload){
			// use the status code called back by the handler or default to 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			// use the payload called  back by the handler or default to empty Object
			payload = typeof(payload) == 'object' ? payload : {};

			// Conver the payload to a String
			var payloadString = JSON.stringify(payload);

			// Return the Response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			//Log the Request Path 
			console.log('Returning this response: ', statusCode, payloadString);

		});

		// Send the Response
		//res.end('Hello World!!\n');

		// Log the Request Path (the user is asking for like /admin, /user)
		//console.log('Request receieved on path:' + trimmedPath + ' with this method: '+ method + ' and with these query sting paramters ', queryStringObject);
		//console.log('Request receieved with these query sting paramters, headers, payload \n', queryStringObject, headers, buffer);
	});
};

// Define the Handlers
var handlers = {};

// Ping Handler
handlers.ping = function(data, callback) {
	callback(200);
};

// Sample Handler
// handlers.sample = function(data, callback){
// 	// Callback a http status code, and a Payload Object
// 	callback(406,{'name': 'sample handler'});
// };

//Not found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// Define a request Router
var router = {
	//'sample' : handlers.sample
	'ping' : handlers.ping
};








