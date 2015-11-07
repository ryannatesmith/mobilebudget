var ex = require('../lib/Exceptions.js');

var Query = function(query) {
	
	/**
	 * start by putting all of the column names in quotes so they are 
	 * used the same in postgres as they appear in the model
	 */
	 
	//double check that this is an array, just in case someone
	//is trying to do something stupid or nefarious
	if(!Array.isArray(query.columns)) {
		throw new ex.SQLWriterException("Error: the select columns are in an invalid format. Please use an array.");
	}
	
	//Make a copy of the array just in case
	var columns = query.columns.slice();
	
	//Now iterate over them and place each one in double quotes;
	columns.forEach(function(column, index, array) {
		column = "\"" + column + "\"";
	});
	
	//Now assign the variable to the object
	this.columns 		= columns;
	
	/**
	 * Now do the same with the table name
	 */
	 
	 //Check that we actually have a string
	if(typeof query.table !== 'string') {
		throw new ex.SQLWriterException("Error: the table name provided is not of type string.");
	}
	
	var table = "\"" + query.table + "\"";
	
	//Now assign it to the object
	this.table 			= table;
	
	/**
	 * Now iterate over the joins and add them to our object
	 */
	 
	//First make sure its an array;
	if(!Array.isArray(query.joins)) {
		throw new ex.SQLWriterException("Error: The joins object must be of type Array.");
	}
	
	//Make a copy so that we can work with it safely
	joins = query.joins.slice();
	
	joins.foreach(function(join, index, array) {
		//check that each element of the join is of type string
		if(typeof join[0] !== 'string') {
			throw new ex.SQLWriterException("Error: the table provided to the join must be of type string.");
		}
		if(typeof join[1] !== 'string') {
			throw new ex.SQLWriterException("Error: the 'own' provided to the join must be of type string.");
		}
		if(typeof join[2] !== 'string') {
			throw new ex.SQLWriterException("Error: the 'other' provided to the join must be of type string.");
		}
		
		join[0] = "\"" + join[0] + "\"";
		join[1] = "\"" + join[1] + "\"";
		join[2] = "\"" + join[2] + "\"";
	});
	
	//Now assign the variable into the object;
	this.joins			= joins;
	
	/**
	 * Now iterate over the joins and add them to our object
	 */
	 
	//First make sure its an array;
	if(!Array.isArray(query.leftJoins)) {
		throw new ex.SQLWriterException("Error: The joins object must be of type Array.");
	}
	
	//Make a copy so that we can work with it safely
	leftJoins = query.joins.slice();
	
	leftJoins.foreach(function(join, index, array) {
		//check that each element of the join is of type string
		if(typeof join[0] !== 'string') {
			throw new ex.SQLWriterException("Error: the table provided to the join must be of type string.");
		}
		if(typeof join[1] !== 'string') {
			throw new ex.SQLWriterException("Error: the 'own' provided to the join must be of type string.");
		}
		if(typeof join[2] !== 'string') {
			throw new ex.SQLWriterException("Error: the 'other' provided to the join must be of type string.");
		}
		
		join[0] = "\"" + join[0] + "\"";
		join[1] = "\"" + join[1] + "\"";
		join[2] = "\"" + join[2] + "\"";
	});
	
	//Now assign the variable into the object
	this.leftJoins		= leftJoins;
	
	this.where			= query.where;
	this.whereValues	= query.whereValues;
	this.limit			= query.limit;
	this.offset			= query.offset;
	this.orderBy		= query.orderBy;
	this.groupBy		= query.groupBy;
}