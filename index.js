require('es6-promise').polyfill();
require('isomorphic-fetch');
var _ = require('lodash');

/*
 *
 *
*/
function resolve(input, callback) {
	if(_.isEmpty(input)) {
		return callback(null, input);
	}
	if(!_.isArray(input) && !_.isObject(input)) {
		return callback(null, input);
	}

	if(_.isArray(input)) {
		return callback(null, input.map(resolve));
	}

	Object.keys(input).forEach(function(key) {
		if(isJsonRef(input[key])) {
			input[key] = walk(input, parseJsonRefFragmentPath(input[key].$ref))
		}
	});
	callback(null, input);
};


/*
 * Walks an object with a path and returns the result that the path is pointing 
 * to it
 *
 * @param {object} obj - input object
 * @param {array} path - an array of string 
 * 
 * @return {any}
 *
*/
function walk(obj, path) {
	if(_.isEmpty(path)) {
		return obj;
	}
	return walk(obj[path[0]], path.slice(1));
}

/*
 * Checks if an object is a JOSN Reference object with a valid URL in the $ref
 * 
 * @param {any} input
 * 
 * @return {boolean}
*/
function isJsonRef(input) {
	if(_.isObject(input) && typeof input.$ref === 'string') {
		// TODO: check input.$ref is a valid URL
		return true;
	}
	return false;
}

/*
 * Parses a JSON References fragment path
 * 
 * @input {string}
 *
 * @output {array} array of strings (keys)
 *
*/
function parseJsonRefFragmentPath(path) {
	if(typeof path !== 'string') {
		throw new TypeError('path must be a string');
	}

	if(path.substring(0, 2) !== '#/') {
		throw new Error('path must be a fragment path');
	}

	// removing #/ from beginning of the string
	path = path.substring(2);

	return path.split('/');

}

module.exports = {resolve: resolve};