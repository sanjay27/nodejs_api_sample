/*
 * Library for storing and editing data
 */

 //Dependies
 var fs = require('fs');
 var path = require('path');

 // Container for the Module
var lib = {};

// Base Dir of the Data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write data to a file under the collection(folder)
lib.create = function(dir,file,data,callback){
	// Open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
		if(!err && fileDescriptor){
			//Convert data to String
			var stringData = JSON.stringify(data);

			// Write to file and Close it
			fs.writeFile(fileDescriptor, stringData, function(err){
				if (!err) {
					fs.close(fileDescriptor,function(err){
						if(!err){
							callback(false);
						} else {
							callback('Error Closing the File');
						}
					});
				} else {
					callback('Error writing to new file');
				}
			});

		} else {
			callback('Could not create new file, it may already exist');
		}

	});
};

// REad Data from a file
lib.read = function(dir,file,callback) {
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
		callback(err,data);
	});
};

// update data inside a file
lib.update = function(dir,file,data,callback){
	// Open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+', function(err,fileDescriptor){
		if(!err && fileDescriptor){
			//Convert data to String
			var stringData = JSON.stringify(data);

			//Truncate the file
			fs.truncate(fileDescriptor, function(err){
				if(!err) {
					// Write to file and close it
					fs.writeFile(fileDescriptor, stringData, function(err){
						if(!err) {
							fs.close(fileDescriptor, function(err){
								if(!err) {
									callback(false);
								} else {
									callback('Error Closing file');
								}
							});
						} else {
							callback('Error Writing to Existing File')
						}
					});
				} else {
					callback('error trunacting file');
				}
			});
		} else
			callback('could not open file for Updating, it may not exist yet', err);
	});

};

// Delete  a file
lib.delete = function(dir,file,callback) {
	//Unlink = remove file from filesystem
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
		if(!err) {
			callback(false);
		} else {
			callback('Error deleting the file');
		}
	});
};

// Export the Module
module.exports = lib;
