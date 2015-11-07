var pg = require('pg');
var config = require('config.js');

var PGSqlError = function(message) {
	this.name 		= "PGSqlError";
	this.message 	= message;
}

//set up the connection string
var conString = "postgres://" + config.user + ":" + config.password + "@" + config.host + "/" + config.database;

var client = new pg.Client(constring);

return client;

var connect = client.connect(function(err) {
	if(err) {
		throw new PGSqlError("Unable to connect to the database. \n" + err);
	}
}

var writer = {};

writer.query = function(query) {
	connect();
	
	return client.query(query);
}
