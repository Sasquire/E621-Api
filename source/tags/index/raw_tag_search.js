import download from './../../download/download.__TARGET__.js';
import {
	validate_string,
	validate_counting_number,
	validate_page_string,
	validate_boolean,
	validate_from_list
} from './../../validation/validation.js';

async function raw_tag_search (settings) {
	validate_settings(settings);
	return download.call(this, {
		method: 'GET',
		path: '/tags',
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
	if (settings['search[id]'] !== null) {
		validate_counting_number(settings['search[id]'], 'search[id]');
	}

	if (settings['search[fuzzy_name_matches]'] !== null) {
		validate_string(settings['search[fuzzy_name_matches]'], 'search[fuzzy_name_matches]');
	}

	if (settings['search[name_matches]'] !== null) {
		validate_string(settings['search[name_matches]'], 'search[name_matches]');
	}

	if (settings['search[name]'] !== null) {
		validate_string(settings['search[name]'], 'search[name]');
	}

	if (settings['search[category]'] !== null) {
		validate_counting_number(settings['search[category]'], 'search[category]');
	}

	if (settings['search[hide_empty]'] !== null) {
		validate_boolean(settings['search[hide_empty]'], 'search[hide_empty]');
	}

	if (settings['search[has_wiki]'] !== null) {
		validate_boolean(settings['search[has_wiki]'], 'search[has_wiki]');
	}

	if (settings['search[has_artist]'] !== null) {
		validate_boolean(settings['search[has_artist]'], 'search[has_artist]');
	}

	if (settings['search[is_locked]'] !== null) {
		validate_boolean(settings['search[is_locked]'], 'search[is_locked]');
	}

	if (settings['search[hide_wiki]'] !== null) {
		validate_boolean(settings['search[hide_wiki]'], 'search[hide_wiki]');
	}

	if (settings['search[order]'] !== null) {
		validate_from_list(settings['search[order]'], ['name', 'date', 'count', 'similarity'], 'search[order]');
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

	if (settings['search[id]'] !== null) {
		return_object['search[id]'] = settings['search[id]'];
	}

	if (settings['search[fuzzy_name_matches]'] !== null) {
		return_object['search[fuzzy_name_matches]'] = settings['search[fuzzy_name_matches]'];
	}

	if (settings['search[name_matches]'] !== null) {
		return_object['search[name_matches]'] = settings['search[name_matches]'];
	}

	if (settings['search[name]'] !== null) {
		return_object['search[name]'] = settings['search[name]'];
	}

	if (settings['search[category]'] !== null) {
		return_object['search[category]'] = settings['search[category]'];
	}

	if (settings['search[hide_empty]'] !== null) {
		return_object['search[hide_empty]'] = settings['search[hide_empty]'];
	}

	if (settings['search[has_wiki]'] !== null) {
		return_object['search[has_wiki]'] = settings['search[has_wiki]'];
	}

	if (settings['search[has_artist]'] !== null) {
		return_object['search[has_artist]'] = settings['search[has_artist]'];
	}

	if (settings['search[is_locked]'] !== null) {
		return_object['search[is_locked]'] = settings['search[is_locked]'];
	}

	if (settings['search[order]'] !== null) {
		return_object['search[order]'] = settings['search[order]'];
	}

	if (settings.limit !== null) {
		return_object.limit = settings.limit;
	}

	if (settings.page !== null) {
		return_object.page = settings.page;
	}

	return return_object;
}

export { raw_tag_search };
