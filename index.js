require('es6-promise').polyfill();
var path = require('path');
var fetch = require('isomorphic-fetch');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

/*
 * Resolve JSON Reference in input
 *
 * @param {any} input
 *
 * @param {object} options withproperties:
 *    {string} basePath - relative paths base path. defaults to __dirname or (location.origin + location.pathname)
 *
 * @param {function} - an error first callback that resolves
 *   to result of JSON Reference resolution
 *
*/
function resolve(input, options, callback) {
    var defaultOptions = {
        basePath: (typeof __dirname === 'string') ? __dirname : (location.origin + location.pathname)
    };

    if (!_.isFunction(callback) && !_.isFunction(options)) {
        throw new TypeError('callback must be a function');
    }

    if (!_.isFunction(callback) && _.isFunction(options)) {
        callback = options;
        options = defaultOptions;
    }

    options.basePath = options.basePath || defaultOptions.basePath;

    if(_.isEmpty(input)) {
        return callback(null, input);
    }

    if(!_.isArray(input) && !_.isObject(input)) {
        return callback(null, input);
    }


    var keys = _.keys(input);

    async.each(
        keys,
        function (key, callback) {
            if(!isJsonRef(input[key])) {
                return callback(null);
            }

            var ref = input[key].$ref;

            // fragment URL
            if (/^#\//.test(ref)) {

                try {
                    input[key] = walk(input, parseJsonRefFragmentPath(ref));
                    callback(null);
                } catch (err) {
                    callback(err);
                }
                return;
            }

            var url = null;
            // absolute URL
            if (/^(http|https)/.test(ref)) {
                url = ref;
            }
            // relative URL
            else if (/^\.\//.test(ref)) {
                url = path.join(options.basePath, ref);
            }

            if (url === null) {
                return callback(new Error('$ref url is invalid: ' + url));
            }

            // File path
            if (_.startsWith(url, '/')) {
                fs.readFile(url, function (error, file) {
                    if (error) { return callback(error); }

                    try {
                        handleJSON(JSON.parse(file.toString()));
                    } catch (error) {
                        callback(error);
                    }
                });

            // HTTP path
            } else {
                fetch(url)
                    .then(function (resp) { return resp.json(); })
                    .then(handleJSON)
                    .catch(callback);
            }

            function handleJSON(json) {
                resolve(json, function(error, result) {
                    if (error) return callback(error);

                    if (/#\//.test(ref)) {
                        var fragmentRef = ref.substring(ref.indexOf('#/'));
                        try {
                            input[key] = walk(result, parseJsonRefFragmentPath(fragmentRef));
                        } catch (err) {
                            callback(err);
                        }
                    } else {
                        input[key] = result;
                    }

                    callback(null);
                });
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

    var result = path.split('/');


    return result;

}

module.exports = {resolve: resolve};