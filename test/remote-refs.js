var resolve = require('../index.js').resolve;
var expect = require('chai').expect;
 
describe('remote JSON Pointers', function () {
	it('of absolute paths are resolved', function(done) {
		var input = {
			foo: 100,
			bar: { $ref: 'https://gist.githubusercontent.com/saharj/0dcb6d90c17a303d5f97a9bc3b4d94ae/raw/7b5dfc793b3d6a7f15e0dd65ccb4380cfcb5732d/foobar.json'}
		};
		var output = {
			foo: 100,
			bar: {
				foo: 10,
				bar: 20
			}
		};
		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output);
			done(error);
		});
	});

	it('of absolute paths combined with fragment paths are resolved', function(done) {
		var input = {
			foo: 100,
			bar: {
				$ref: 'https://gist.githubusercontent.com/saharj/0dcb6d90c17a303d5f97a9bc3b4d94ae/raw/23e81469807cc70a081d236d1a35c2e42bc858bb/foobarbaz.json#/bar/baz'
			}
		};

		var output = {
			foo: 100,
			bar: 88
		};

		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output);
			done(error);
		});
	});

	// TODO
	describe('for relative paths', function() {
	});
});