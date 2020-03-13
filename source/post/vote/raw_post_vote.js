import download from './../../download/download.__TARGET__.js';
import {
	validate_counting_number,
	validate_vote_option
} from './../../validation/validation.js';

// vote override option

async function raw_post_vote (settings) {
	validate_counting_number(settings.post_id, 'post_id');
	validate_vote_option(settings.vote);

	return download.call(this, {
		method: 'POST',
		path: `/posts/${settings.post_id}/votes`,
		response: 'JSON',

		format: 'URL',
		data: {
			score: settings.vote
		},
		authenticate: true
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { raw_post_vote };
