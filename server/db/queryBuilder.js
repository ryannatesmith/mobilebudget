//Author: Ryan Nathaniel Smith: natesmith@yandex.ru

var pg = require('pgWriter.js');

var QueryException = function(message) {
	this.name = "QueryException";
	this.message = message;
}

/**
 * The query builder is the object that we use to construct all of our
 * queries to the database, regardless of which implementation the end user
 * chooses. All queries will be passed through here, and any validation that
 * can be done globally occurs here. For implementation specific validation
 * see the relevant classes.
 *
 */

var QueryBuilder = function(config) {
	
	/**
	 * columns - An array of strings representing the columns we want to query
	 * from the database.
	 */
	this.columns;
	 
	/**
	 * table - A string representing the database table we want to query
	 */
	this.table;
	 
	/**
	 * joins - An array of [{table},{own},{other}]
	 * objects that we use for inner joins on the query
	 */
	this.joins;
	
	/**
	 * leftJoins - An array of [{table},{own},{other}]
	 * objects that we use for inner joins on the query
	 */
	this.leftJoins;
	
	/**
	 * where - An array of {column}{operator}${index} used to filter results
	 */
	this.where;
	
	/**
	 * whereValues - An array of strings used to pass parameterized queries to
	 * the database. This is more secure than a raw entry
	 */
	this.whereValues;
	
	/**
	 * limit - An integer representing the maximum number of results to return
	 * for a query
	 */
	this.limit;
	
	/**
	 * offset - An integer representing the number of records to skip before
	 * returning results
	 */
	this.offset;
	
	/**
	 * orderBy - An object with two strings representing
	 * the column and order by which results or ordered for return
	 */
	this.orderBy;
	
	/**
	 * groupBy - An array of strings indicating how results should be grouped
	 */
	this.groupBy;
	
	/**
	 * Choose our SQL writer based on the config passed to the function
	 */
	if(config.database = 'pgsql') {
		this.writer = pg;
	}
}

QueryBuilder.prototype.select = function(columns) {
	//Make sure we have an array because we're going to iterate over it later
	//or null and we can simply do select *
	if(!Array.isArray(columns) && columns !== null) {
		throw new QueryException("Error: the first arugment passed to select must be an array.");
	}
	
	this.columns = columns;
	return this;

}

QueryBuilder.prototype.from = function(table) {
	this.table = table;
	return this;

}

QueryBuilder.prototype.join = function(table, own, other) {
	if(typeof table !== 'string') {
		throw new QueryException("Error: Argument 1 to QueryBuilder.join is not of type string.");
	}
	if(typeof own !== 'string') {
		throw new QueryException("Error: Argument 2 to QueryBuilder.join is not of type string.");
	}
	if(typeof other !== 'string') {
		throw new QueryException("Error: Argument 3 to QueryBuilder.join is not of type string.");
	}
	
	this.joins = this.joins || [];
	this.joins.push([table, own, other]);
	return this;
	
}

QueryBuilder.prototype.leftJoin = function(table, own, other) {
	if(typeof table !== 'string') {
		throw new QueryException("Error: Argument 1 to QueryBuilder.leftJoin is not of type string.");
	}
	if(typeof own !== 'string') {
		throw new QueryException("Error: Argument 2 to QueryBuilder.leftJoin is not of type string.");
	}
	if(typeof other !== 'string') {
		throw new QueryException("Error: Argument 3 to QueryBuilder.leftJoin is not of type string.");
	}
	this.leftJoins = this.leftJoins || [];
	this.leftJoins.push([table, own, other]);
	return this;
	
}

QueryBuilder.prototype.where = function(column, operator, value) {
	if(value === null || value === undefined) {
		value = operator;
		operator = '=';
	}
	
	this.where = this.where || [];
	this.whereValues = this.whereValues || [];
	
	this.where.push(column + operator + '$' + this.where.length);
	this.whereValues.push(value);
	
	return this;
}

QueryBuilder.prototype.limit = function(limit) {
	if(isNaN(limit)) {
		throw new QueryException("Error: the limit passed must be a number");
	}
	
	this.limit = limit;
	return this;
}

QueryBuilder.prototype.offset = function(offset) {
	if(isNaN(limit)) {
		throw new QueryException("Error: the offset passed must be a number");
	}
	
	this.offset = offset;
	return this;
}

QueryBuilder.prototype.orderBy = function(column, order) {
	this.orderBy.column = column;
	this.orderBy.order = order === 'asc' || order === 'desc' ? order : 'asc';
}

QueryBuilder.prototype.groupBy = function(columns) {
	this.groupBy = Array.isArray(columns) ? columns : [columns];
	return this;
}