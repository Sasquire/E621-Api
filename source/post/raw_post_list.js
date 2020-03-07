import download from './../download/download.__TARGET__.js';
import { validate_string } from './../validation/validation.js';

async function raw_post_list (tag_search) {
	validate_string(tag_search);

	return download.call(this, {
		method: 'GET',
		path: '/posts',
		response: 'JSON',

		format: 'URL',
		data: {
			limit: 320,
			tags: tag_search
		}
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { raw_post_list };
