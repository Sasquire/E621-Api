const E621API = require('./../distribution/e621_API.node.js');
const validation = require('./../distribution/validation.test.node.js');
const assert = require('assert');

console.log(validation);

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

describe('Validation', () => {
	describe('md5', () => {
		// Testing non-strings
		[
			[],
			['value', 'string'],
			{},
			{ value: 'string' },
			32,
			undefined,
			null,
			0,
			() => false,
			false,
			true,
			!!false
		].forEach(e => {
			it(`fails on ${e}`, () => {
				assert.throws(() => validation.validate_md5(e));
			});
		});

		// Testing improper length
		[]
			// Below 32
			.concat(
				new Array(32).fill('').map((e, i) => {
					return [new Array(i).fill('0').join(''), i];
				})
			)
			// Above 32
			.concat(
				new Array(32).fill('').map((e, i) => {
					return [new Array(i + 33).fill('0').join(''), i + 33];
				})
			)
			.forEach(([e, length]) => {
				it(`fails on length ${length}`, () => {
					assert.throws(() => validation.validate_md5(e));
				});
			});

		// Testing non-hex characters
		new Array(90).fill('').map((e, i) => {
			return new Array(32).fill(String.fromCharCode(i + 32)).join('');
		})
			.filter(e => ('0123456789ABCDEFabcdef'.includes(e.charAt(0)) === false))
			.forEach(e => {
				it(`fails on character ${e.charAt(0)}`, () => {
					assert.throws(() => validation.validate_md5(e));
				});
			});
	});
});

describe('raw_post_show', () => {
	it('post_id', () => assert.doesNotReject(() =>
		e621.raw_post_show_id(14)
	));

	it('md5', () => assert.doesNotReject(() =>
		e621.raw_post_show_md5('3e47080200fbde2d7d2ccf419343ab0a')
	));
});
