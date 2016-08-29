var resolve = require('../index.js').resolve;
var expect = require('chai').expect;

describe('local JSON Pointers', function () {
	it('resolves a shallow reference', function(done) {
		var input = {
			foo: 100,
			bar: { $ref: '#/foo' }
		};
		var output = {
			foo: 100,
			bar: 100
		};
		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output)
			done();
		})
	});
	it('resolves a deep reference', function(done) {
		var input = {
			foo: {
				baz: {
					que: {num: 10}
				}
			},
			bar: { $ref: '#/foo/baz/que' }
		};
		var output = {
			foo: {
				baz: {
					que: {num: 10}
				}
			},
			bar: {num: 10}
		};
		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output);
			done();
		})
	});
});

//describe('ignores $ref siblings')