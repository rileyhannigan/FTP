#!/usr/bin/env node --harmony
var co = require("co");
var prompt = require("co-prompt");
var program = require('commander');
var Client = require("ftp");
var fs = require("fs");
var c = new Client();

function startConfig() {
	co(function *() {
		var host = yield prompt("host: ");
		var user = yield prompt("user: ");
		var password = yield prompt.password("password: ");
		config = {
			host: host,
			port: 21,
			user: user,
			password: password
		};
		c.connect(config);
		getFile();
	});
}

function getFile() {
	co(function *() {
		var fileDirectory = yield prompt("File Directory: ");
		var fileName = yield prompt("File Name: ");
		c.get(fileDirectory + "/" + fileName, function(err, stream) {
			if (err) throw err;
			stream.pipe(fs.createWriteStream("copy-" + fileName));
			checkIfGetFile();
		});
	});	
}

function checkIfGetFile() {
	co(function *() {
		var exitResponce = yield prompt("Get another file? If so, type 'yes' or type anything else to exit: ");
		if (exitResponce === "yes") {
			exitResponce = ""
			getFile();
		} else {
			process.exit(0);
		}
	});
}

startConfig();
