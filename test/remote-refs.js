var resolve = require('../index.js').resolve;
var expect = require('chai').expect;
 
describe('remote JSON Pointers', function () {
	describe('absolute paths', function() {
		var input = {
			foo: 100,
			bar: { $ref: 'https://gist.githubusercontent.com/saharj/0dcb6d90c17a303d5f97a9bc3b4d94ae/raw/7b5dfc793b3d6a7f15e0dd65ccb4380cfcb5732d/foobar.json'}
		}
	});

	// TODO
	describe('relative paths', function() {

	});
});