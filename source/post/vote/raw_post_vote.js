import download from './../../download/download.__TARGET__.js';
import {
	validate_counting_number,
	validate_vote_option,
	validate_boolean
} from './../../validation/validation.js';

async function raw_post_vote (settings) {
	validate_settings(settings);

	return download.call(this, {
		method: 'POST',
		path: `/posts/${settings.id}/votes`,
		response: 'JSON',

		format: 'URL',
		data: make_data(settings),
		authenticate: true
	}).catch(handle_error);
}

async function post_vote_remove (id) {
	return download.call(this, {
		method: 'DELETE',
		path: `/posts/${id}/votes`,
		response: 'JSON',

		format: undefined,
		data: undefined,
		authenticate: true
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

function validate_settings (settings) {
	validate_counting_number(settings.id, 'post_id');
	validate_vote_option(settings.score);

	if (settings.no_unvote !== null) {
		validate_boolean(settings.no_unvote, 'no_unvote');
	}
}

function make_data (settings) {
	const return_object = {
		score: settings.score
	};

	if (settings.no_unvote !== null) {
		return_object.no_unvote = settings.no_unvote;
	}

	return return_object;
}

export {
	raw_post_vote,
	post_vote_remove
};
