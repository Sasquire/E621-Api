import validate_settings from './validate_settings.js';
import axios from 'axios';
import FormData from 'form-data';

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
	validate_settings.call(this, settings);
	const request_options = build_request_options.call(this, settings);
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

	const has_credentials = (this.username !== undefined && this.api_key !== undefined);
	if (settings.authenticate || has_credentials) {
		request_options.auth = {
			username: this.username,
			password: this.api_key
		};
	}

	if (settings.format === 'URL') {
		request_options.params = settings.data;
	} else if (settings.format === 'FORM') {
		const form = new FormData();
		Object.entries(settings.data).forEach(([key, value]) => {
			if (value.constructor === ArrayBuffer) {
				form.append(key, Buffer.from(value), {
					filename: 'upload.image',
					contentType: 'application/octet-stream'
				});
			} else {
				form.append(key, value);
			}
		});
		request_options.headers['content-type'] = form.getHeaders()['content-type'];
		request_options.data = form;
	} else {
		// Format is undefined. Apply no settings
	}

	return request_options;
}

function handle_error (error) {
	// TODO
	throw error;
}

export default download;
