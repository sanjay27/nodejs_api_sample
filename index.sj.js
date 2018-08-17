/* 
* index.sj.js
*
*/

// Dependencies
var http = require('http');
var url = require('url');

// The Server should respond to all Requests with a String
var server = http.createServer(function(req, res){

	//Get the URL and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the Path from the URL
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');


	//Get the HTTP Method
	var method = req.method.toLowerCase();


	// send the Responce
	res.end('Hello World!\n');

	// Log the Request Path
	console.log('Request received on path: '+ trimmedPath + ' with this Method: '+ method);

});

//Start the Server and hove it listen on port 3000
server.listen(3000,function(){
	console.log("The Server is listening on Port 3000 now");
});