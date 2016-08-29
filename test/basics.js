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