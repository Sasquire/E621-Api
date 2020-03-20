import download from './../../download/download.__TARGET__.js';
import {
	validate_counting_number,
	validate_string
} from './../../validation/validation.js';

// Add support for ['do_not_bump_post', 'is_sticky', 'is_hidden']

async function raw_comment_create (settings) {
	validate_settings(settings);

	return download.call(this, {
		method: 'POST',
		path: '/comments',
		response: 'JSON',

		format: 'FORM',
		data: {
			'comment[post_id]': settings['comment[post_id]'],
			'comment[body]': settings['comment[body]']
		},
		authenticate: true
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

function validate_settings (settings) {
	validate_counting_number(settings['comment[post_id]'], 'comment[post_id]');
	validate_string(settings['comment[body]'], 'comment[body]');
}

export { raw_comment_create };
