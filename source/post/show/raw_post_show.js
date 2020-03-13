import download from './../../download/download.__TARGET__.js';
import { validate_counting_number } from './../../validation/validation.js';

async function raw_post_show (settings) {
	validate_counting_number(settings.id, 'post_id');

	return download.call(this, {
		method: 'GET',
		path: `/posts/${settings.id}`,
		response: 'JSON',

		format: undefined,
		data: null
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { raw_post_show };
