/*global require, describe, it, afterEach */

const assert = require('assert');
const User = require('../../src/javascript/core/user');

describe('Core.User', function () {

	let userID;

	afterEach(function () {
		User.destroy();
	});

	describe('no preset value', function () {
		it('should init', function () {
			assert.doesNotThrow(function () {
				userID = User.init();
			});
		});

		it('should use generate an ID if one does not exist', function () {
			assert.equal(User.userID(), userID);
		});
	});

	describe('use init with an existing value', function () {
		it('should use an object', function () {
			User.init('value1');
		});

		it('should retrieve the userID ', function () {
			assert.equal(User.userID(), 'value1');
		});

		it('should use a string', function () {
			User.init('value2');
		});

		it('should retrieve the userID ', function () {
			assert.equal(User.userID(), 'value2');
		});
	});

	describe('retrieving values.', function () {
		it('should use the existing value, even if a new one is provided.', function () {
			User.init('value2');
			User.init('value3');
			assert.equal(User.userID(), 'value2');
		});
	});

	describe('user ID from query param', function () {
		it('should parse a simple query', function () {
			assert.equal(User.userIDFromQuery('spoor-id', '?spoor-id=abc'), 'abc');
		});

		it('should parse the second of three params', function () {
			assert.equal(User.userIDFromQuery('spoor-id', '?a=b&spoor-id=abc&y=z'), 'abc');
		});

		it('should ignore empty param', function () {
			assert.equal(User.userIDFromQuery('spoor-id', '?spoor-id='), undefined);
		});

		it('should handle special chars', function () {
			assert.equal(User.userIDFromQuery('spoor-id', '?spoor-id=ab^@£$()£$-_9012&b=c'), 'ab^@£$()£$-_9012');
		});
	});

});
