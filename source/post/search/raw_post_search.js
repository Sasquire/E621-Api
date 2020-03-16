import download from './../../download/download.__TARGET__.js';
import {
	validate_string,
	validate_counting_number,
	validate_page_string
} from './../../validation/validation.js';

// There is an edge case where the data can be md5=<md5>

async function raw_post_search (settings) {
	validate_settings(settings);

	return download.call(this, {
		method: 'GET',
		path: '/posts',
		response: 'JSON',

		format: 'URL',
		data: make_data(settings)
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

function validate_settings (settings) {
	if (settings.tags !== null) {
		validate_string(settings.tags, 'tags');
	}

	if (settings.limit !== null) {
		validate_counting_number(settings.limit, 'limit');
	}

	if (settings.page !== null) {
		validate_page_string(settings.page, 'page');
	}
}

function make_data (settings) {
	const return_object = {};

	if (settings.limit !== null) {
		return_object.limit = settings.limit;
	}

	if (settings.tags !== null) {
		return_object.tags = settings.tags;
	}

	if (settings.page !== null) {
		return_object.page = settings.page;
	}

	return return_object;
}

export { raw_post_search };
