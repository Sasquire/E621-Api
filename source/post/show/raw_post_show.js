import download from './../../download/download.__TARGET__.js';
import { validate_post_id } from './../../validation/validation.js';

async function raw_post_show (post_id) {
	validate_post_id(post_id);

	return download.call(this, {
		method: 'GET',
		path: `/posts/${post_id}`,
		response: 'JSON',

		format: 'URL',
		data: null
	}).catch(handle_post_show_error);
}

function handle_post_show_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { raw_post_show };
