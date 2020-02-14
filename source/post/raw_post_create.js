import download from './../download/download.__TARGET__.js';
import { validate_post_id } from './../validation/validation.js';

async function raw_post_create (settings) {
	validate_settings(settings);

	return download.bind(this)({
		method: 'POST',
		path: '/post/create',
		response: 'JSON',

		format: 'FORM',
		data: make_data(settings)
	}).catch(handle_post_show_error);
}

function make_data (settings) {

}

function validate_settings (settings) {
	if (settings['post[tags]'] === undefined) {
		throw new Error('post[tags] must be present');
	} else if (Array.isArray(settings['post[tags]']) === false) {
		throw new Error('post[tags] must be of type array');
	} else if (settings['post[tags'].every(e => (typeof e === 'string'))) {
		throw new Error('post[tags] must be comprised of only strings');
	}

	// file and url interaction

	// rating

	// source

	if (settings['post[description]'] === undefined) {
		throw new Error('post[description] must be present');
	} else if (typeof settings['post[description]'] !== 'string') {
		throw new Error('post[description] must be of type string');
	}

	if (settings['post[parent_id'] === undefined) {
		throw new Error('post[parent_id] must present');
	} else if (settings['post[parent_id'] === null) {
		// It is fine if parent_id is null
	} else {
		validate_post_id(settings['post[parent_id]']);
	}
}

function handle_post_show_error (error) {
	// Todo
	console.log(error);
	throw error;
}
