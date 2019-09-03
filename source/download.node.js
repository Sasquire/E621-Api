import axios from 'axios';

/* Input to this method is structured like this
{
	method: 'POST' | 'GET' // Defines how the request should be made
	path: <string> // The path of the URL that is being accessed
	response: 'JSON' | 'XML' | 'HTML' // Defines the response type

	format: 'URL' | 'FORM' | undefined // Defines how the data is passed
	data: <object> | undefined // Data being passed in the request
}

*/
async function download (settings) {
	validate_settings.bind(this)(settings);
	const request_options = build_request_options.bind(this)(settings);
	return axios.request(request_options)
		.then(response => response.data)
		.catch(handle_error);
}

function validate_settings (settings) {
	if (['POST', 'GET'].includes(settings.method) === false) {
		throw new Error('method must be POST or GET');
	}

	if (typeof settings.path !== 'string') {
		throw new Error('path must be a string');
	}

	if (['JSON', 'XML', 'HTML'].includes(settings.response) === false) {
		throw new Error('response must be JSON or XML or HTML');
	}

	if (['URL', 'FORM', undefined].includes(settings.format) === false) {
		throw new Error('format must be URL or FORM or undefined');
	}

	if (['object', 'undefined'].includes(typeof settings.data) === false) {
		throw new Error('data must be an object or undefined');
	}

	if (typeof this.useragent !== 'string') {
		throw new Error('useragent must be a string');
	}

	if (settings.authenticate === true) {
		// If authenticating, then both username and api_key must be present
		if (typeof this.username !== 'string') {
			throw new Error('useragent must be a string');
		} else if (typeof this.api_key !== 'string') {
			throw new Error('api_key must be a string');
		}

		if (settings.data === undefined) {
			throw new Error('data can not be undefined if authenticating');
		}

		if (settings.format === undefined) {
			throw new Error('format can not be undefined if authenticating');
		}
	}
}

function build_request_options (settings) {
	const request_options = {
		baseURL: 'https://e621.net/',
		url: `${settings.path}.${settings.response.toLowerCase()}`,
		method: settings.method,
		// Document is only valid for the browser. To fix this only
		// json is used for actual json. HTML and XML will have to be
		// parsed by other means.
		// https://github.com/axios/axios/issues/667#issuecomment-335013993
		responseType: settings.response === 'JSON' ? 'json' : 'text',
		headers: {
			'user-agent': this.useragent
		}
	};

	settings.data.login = this.username;
	settings.data.password_hash = this.api_key;

	if (settings.format === 'URL') {
		request_options.params = settings.data;
	} else if (settings.format === 'FORM') {
		request_options.data = settings.data;
	} else {
		// Format is undefined. Apply no settings
	}

	return request_options;
}

function handle_error (error) {
	// Todo
	console.log(error);
}

export default download;
