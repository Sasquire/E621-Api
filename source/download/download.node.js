import validate_settings from './validate_settings.js';
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

	// settings.data is guaranteed to exist if authenticating
	if (settings.authenticate) {
		settings.data.login = this.username;
		settings.data.password_hash = this.api_key;
	}

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
	throw error;
}

export default download;
