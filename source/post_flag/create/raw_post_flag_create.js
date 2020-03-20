import download from './../../download/download.__TARGET__.js';
import { validate_counting_number } from './../../validation/validation.js';

async function raw_post_flag_create (settings) {
	validate_settings(settings);

	return download.call(this, {
		method: 'POST',
		path: '/post_flags',
		response: 'JSON',

		format: 'URL',
		data: make_data(settings),
		authenticate: true
	}).catch(handle_error);
}

function validate_settings (settings) {
	validate_counting_number(settings['post_flag[post_id]'], 'post_flag[post_id]');
	const valid_reason = [
		'deletion',
		'inferior',
		'user',
		'dnp_artist',
		'pay_content',
		'trace',
		'previously_deleted',
		'real_porn',
		'corrupt'
	];

	if (valid_reason.includes(settings['post_flag[reason_name]']) === false) {
		throw new Error(`post_flag[reason_name] must be one of [${valid_reason.join(', ')}]`);
	}

	if (settings['post_flag[reason_name]'] === 'user') {
		if (typeof settings['post_flag[user_reason]'] !== 'string')	{
			throw new Error('if post_flag[reason_name] is \'user\' then post_flag[user_reason] must be a string');
		}
	} else if (settings['post_flag[user_reason]'] !== null) {
		throw new Error('post_flag[user_reason] must be null unless post_flag[reason_name] is \'user\'');
	}

	if (settings['post_flag[reason_name]'] === 'inferior') {
		validate_counting_number(settings['post_flag[parent_id]'], 'post_flag[parent_id]');
	} else if (settings['post_flag[parent_id]'] !== null) {
		throw new Error('post_flag[parent_id] must be null unless post_flag[parent_id] is \'inferior\'');
	}
}

function make_data (settings) {
	const return_object = {
		'post_flag[post_id]': settings['post_flag[post_id]'],
		'post_flag[reason_name]': settings['post_flag[reason_name]']
	};

	if (settings['post_flag[reason_name]'] === 'user') {
		return_object['post_flag[user_reason]'] = settings['post_flag[user_reason]'];
	} else if (settings['post_flag[reason_name]'] === 'inferior') {
		return_object['post_flag[parent_id]'] = settings['post_flag[parent_id]'];
	}

	return return_object;
}

function handle_error (err) {
	console.log(err);
	throw err;
};

export { raw_post_flag_create };
