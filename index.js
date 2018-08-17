/*
* Primary file for the API
*
*/

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

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
			'payload' : helpers.parsedJsonToObject(buffer)
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

// Define a request Router
var router = {
	//'sample' : handlers.sample
	'ping' : handlers.ping,
	'users': handlers.users
};
