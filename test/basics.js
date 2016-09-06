var resolve = require('../index.js').resolve;
var expect = require('chai').expect;

describe('basics', function() {
	it('returns empty object when you pass an empty object', function(done) {
		resolve({}, function(error, result) {
			expect(result).to.deep.equal({});
			done();
		});
	});

	it('returns primitive values when input is primitive', function(done) {
		resolve(1, function(error, result){
			expect(result).to.equal(1);

			resolve('a', function(error, result) {
				expect(result).to.equal('a');

				resolve(true, function(error, result) {
					expect(result).to.equal(true);
					done();
				});
			});
		});
	});
});

describe('arrays', function() {
	it('resolves a pointer to an array item', function(done) {
		var input = [{$ref: '#/1'}, 6];
		var output = [6, 6];
		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output);
			done(error);
		});
	});

	it('resolves a deep pointer in an array', function(done) {
		var input = [
			{foo: {bar: 42}},
			{$ref: '#/0/foo/bar'}
		];
		var output = [
			{foo: {bar: 42}},
			42
		];
		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output);
			done(error);
		});
	});

	it('resolves references that go into an array', function(done) {
		var input = {
			foo: {bar: [{baz: 23}]},
			deep: {$ref: '#/foo/bar/0/baz'}
		};
		var output = {
			foo: {bar: [{baz: 23}]},
			deep: 23
		};
		resolve(input, function(error, result) {
			expect(result).to.deep.equal(output);
			done(error);
		});
	})
})