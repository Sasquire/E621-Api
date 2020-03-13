import download from './../../download/download.__TARGET__.js';
import {
	validate_string,
	validate_counting_number
} from './../../validation/validation.js';

// There is an edge case where the data can be md5=<md5>

async function raw_post_search (settings) {
	validate_string(settings.tags, 'tags');
	validate_counting_number(settings.limit, 'limit');

	return download.call(this, {
		method: 'GET',
		path: '/posts',
		response: 'JSON',

		format: 'URL',
		data: {
			limit: settings.limit,
			tags: settings.tags
		}
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { raw_post_search };
