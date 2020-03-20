import download from './../../download/download.__TARGET__.js';
import { validate_counting_number } from './../../validation/validation.js';

// There is an edge case where the data can be md5=<md5>

async function raw_post_copy_notes (settings) {
	validate_settings(settings);

	return download.call(this, {
		method: 'PUT',
		path: `/posts/${settings.id}/copy_notes`,
		response: 'JSON',

		format: 'URL',
		data: {
			id: settings.id,
			other_post_id: settings.other_post_id
		}
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

function validate_settings (settings) {
	validate_counting_number(settings.id, 'id');
	validate_counting_number(settings.other_post_id, 'other_post_id');
}

export { raw_post_copy_notes };
