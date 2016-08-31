require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');
var _ = require('lodash');
var async = require('async');
// var debug = require('debug')('json-refs-resolver');

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

	var keys = _.keys(input);

	async.each(
		keys,
		function (key, callback) {
			if(isJsonRef(input[key])) {
				var ref = input[key].$ref;
				
				// absolute URL
				if (/^(http|https)/.test(ref)) {
					fetch(ref)
						.then(function (resp) {
							return resp.json();
						})
						.then(function (json) {	
							resolve(json, function(error, result) {
								if (error) return callback(error);

								if (/#\//.test(ref)) {
									var fragmentRef = ref.substring(ref.indexOf('#/'));
									input[key] = walk(result, parseJsonRefFragmentPath(fragmentRef));
								} else {
									input[key] = result;								
								}

								callback(null);
							});
						})
						.catch(callback)
				}
				
				// fragment URL
				else if (/^#\//.test(ref)) {
					try {
						input[key] = walk(input, parseJsonRefFragmentPath(ref));
						callback(null);
					} catch (err) {
						callback(err);
					}
				}

				// relative URL
				else if (/^\.\//.test(ref)) {
					// TODO
				}
			} else {
				callback(null);
			}
		},
		function (error) {
			if (error) {
				callback(error);
			} else {
				callback(null, input);
			}
		}
	);
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