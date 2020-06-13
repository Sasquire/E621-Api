import download from './../../download/download.__TARGET__.js';
import {
	validate_counting_number,
	validate_string
} from './../../validation/validation.js';

async function raw_blip_create (settings) {
	validate_settings(settings);

	return download.call(this, {
		method: 'POST',
		path: '/blips',
		response: 'JSON',

		format: 'FORM',
		data: make_data(settings),
		authenticate: true
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

function validate_settings (settings) {
	if (settings['blip[response_to]'] !== null) {
		validate_counting_number(settings['blip[response_to]'], 'blip[response_to]');
	}

	validate_string(settings['blip[body]'], 'blip[body]');
}

function make_data (settings) {
	const return_object = {
		'blip[body]': settings['blip[body]']
	};

	if (settings['blip[response_to]'] !== null) {
		return_object['blip[response_to]'] = settings['blip[response_to]'];
	}

	return return_object;
}

export { raw_blip_create };
