const E621API = require('./../distribution/e621_API.node.js');
const assert = require('assert');

const e621 = new E621API('api wrapper test');

// To test a certain section
// npm test -- --grep "Section"

/*
describe('Raw Download', () => {
	it('works', () => assert.doesNotReject(() => e621.raw_download({
		method: 'GET', // Defines how the request should be made
		path: '/post/show', // The path of the URL that is being accessed
		response: 'JSON', // Defines the response type

		format: 'URL', // Defines how the data is passed
		data: {
			id: 14
		}
	})));
});
*/

describe('raw_post_show', () => {
	it('post_id', () => assert.doesNotReject(() =>
		e621.raw_post_show_id(14)
	));

	it('md5', () => assert.doesNotReject(() =>
		e621.raw_post_show('3e47080200fbde2d7d2ccf419343ab0a')
	));
});
