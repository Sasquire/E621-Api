import download from './../download/download.__TARGET__.js';
import { validate_md5, validate_post_id } from './../validation/validation.js';

async function raw_post_show (settings) {
	validate_settings(settings);

	return download.bind(this)({
		method: 'GET',
		path: '/post/show',
		response: 'JSON',

		format: 'URL',
		data: make_data(settings)
	}).catch(handle_post_show_error);
}

async function raw_post_show_id (post_id) {
	return raw_post_show.bind(this)({
		post_id: post_id
	});
}

async function raw_post_show_md5 (post_md5) {
	return raw_post_show.bind(this)({
		md5: post_md5
	});
}

function make_data (settings) {
	if (settings.md5) {
		return {
			md5: settings.md5
		};
	} else {
		return {
			id: settings.post_id
		};
	}
}

function validate_settings (settings) {
	const md5_exists = settings.md5 !== undefined;
	const post_id_exists = settings.post_id !== undefined;

	if (md5_exists && post_id_exists) {
		throw new Error('post_id and md5 can not both exist');
	} else if (md5_exists === false && post_id_exists === false) {
		throw new Error('post_id or md5 must exist');
	}

	if (md5_exists) {
		validate_md5(settings.md5);
	}

	if (post_id_exists) {
		validate_post_id(settings.post_id);
	}
}

function handle_post_show_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { raw_post_show, raw_post_show_id, raw_post_show_md5 };
