const download = require('./../distribution/e621_API.node.js');
const assert = require('assert');

// To test a certain section
// npm test -- --grep "Section"

describe('Raw Download', () => {
	it('works', () => assert.doesNotReject(() => download({
		method: 'GET', // Defines how the request should be made
		path: '/post/show', // The path of the URL that is being accessed
		response: 'JSON', // Defines the response type

		format: 'URL', // Defines how the data is passed
		data: {
			id: 14
		},

		user_agent: 'api wrapper test'
	})));
});
