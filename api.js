'use strict';
const https = require('https');
const { URL } = require('url');

const check = {
	// todo actual errors
	is_number: x => {
		if(typeof x != 'number'){
			throw 'a non-negative number must be supplied'
		} else if(x < 0){
			throw 'a non-negative number must be supplied'
		}
	},
	is_md5sum: md5 => {
		if(typeof md5 != 'string'){
			throw 'a md5sum must be supplied'
		} else if(md5.length != 32){
			throw 'md5sums must be 32 characters long'
		}
		// todo check to make sure all characters are hex?
	},
	is_object: obj => {
		if(typeof obj != 'object'){
			throw 'an object must be supplied'
		}
	},
	is_string: str => {
		if(typeof str != 'string'){
			throw 'a string must be supplied'
		}
	},
	is_boolean: bool => {
		if(typeof bool != 'boolean'){
			throw 'a boolean must be supplied'
		}
	},
	is_array: arr => {
		if(Array.isArray(arr) == false){
			throw 'an array must be supplied'
		}
	},
	is_undefined_or: (first, elem) => {
		if(elem !== undefined){
			first(elem);
		}
	}
}

// return falsy, default, truthy
function ss(val, res1, res2, res3){
	if(val == undefined){
		return res2;
	} else if(val){
		return res3;
	} else {
		return res1;
	}
}

class E621API {
	constructor(user_agent, wait_time = 750, username, api_key) {
		if(!user_agent){
			throw 'you must supply a user-agent'
		}
		this.user_agent = user_agent;
		this.wait_time = wait_time;
		this.username = username;
		this.api_key = api_key;
		
		this._queue = [];
		this._running = false;
	}
}

// Does not have a constant wait time, but is close enough.
// In a specific case it will skip waiting. But will never
// go faster than one post at a time. Which is good.
E621API.prototype._add_to_queue = async function(in_options){
	return new Promise((resolve, reject) => {
		this._queue.push([in_options, resolve, reject]);
		if(this._running == false){
			this._step_queue();
		}
	});
}

E621API.prototype._step_queue = function(){
	const tuple = this._queue.pop();
	if(tuple == undefined){
		this._running = false;
		return;
	} else {
		this._running = true;
		const [options, resolve, reject] = tuple;
		Promise.all([
			this._download(options)
				.then(resolve)
				.catch(reject),
			new Promise(r => setTimeout(r, this.wait_time))
		// will this eventually reach max call stack?
		// I've tested it to 20,000 (when normal max
		// stack was 14,000) so probably not.
		]).then(this._step_queue.bind(this));
	}
}

E621API.prototype._download = async function(in_options, attempt = 1){
	const url = new URL(`https://e621.net${in_options.path}.${in_options.type}`);
	Object.entries(in_options.searchParams)
		.forEach(param => url.searchParams.set(param[0], param[1]));

	return new Promise((resolve, reject) => {
		const options = {
			protocol: 'https:',
			host: url.host,
			hostname: url.hostname,
			port: 443,
			method: in_options.method || 'GET',
			path: url.pathname + url.search,
			headers: {
				'User-Agent': this.user_agent
			}
		};

		const req = https.request(options, (response) => {
			response.setEncoding('utf8');
			let data = '';
			// I once got an error when the JSON wasn't complete
			// but it didnt happen again, was this a fluke?
			response.on('data', in_d => data += in_d);
			response.on('end', () => on_data_end(response, data, resolve, reject));
		});
		req.on('error', async (error) => {
			if(attempt <= 4){
				await new Promise(r => setTimeout(r, 10 * 1000));
				this._download(in_options, attempt + 1)
					.then(resolve)
					.then(reject);
			} else {
				reject(error);
			}
		}); // todo handle some responses
		req.end(); 
	});

	function on_data_end(response, data, resolve, reject){
		/*
		200 OK               Request was successful
		403 Forbidden ------ Access denied. May indicate that your request lacks a User-Agent header (see Notice #2 above).
		404 Not Found        Not found
		420 Invalid Record - Record could not be saved
		421 User Throttled   User is throttled, try again later
		422 Locked --------- The resource is locked and cannot be modified
		423 Already Exists          Resource already exists
		424 Invalid Parameters ---- The given parameters were invalid
		500 Internal Server Error   Some unknown error occurred on the server
		502 Bad Gateway ----------- A gateway server received an invalid response from the e621 servers
		503 Service Unavailable     Server cannot currently handle the request or you have exceeded the request rate limit. Try again later or decrease your rate of requests.
		520 Unknown Error --------------- Unexpected server response which violates protocol
		522 Origin Connection Time-out    CloudFlare's attempt to connect to the e621 servers timed out
		524 Origin Connection Time-out -- A connection was established between CloudFlare and the e621 servers, but it timed out before an HTTP response was received
		525 SSL Handshake Failed          The SSL handshake between CloudFlare and the e621 servers failed
		*/
		if(response.statusCode != 200){
			reject(response.statusCode);
		} else if(in_options.type == 'json'){
			resolve(JSON.parse(data));
		} else {
			resolve(data);
		}
	}
}

function destroyed_post_response(post_id){
	return {
		id: post_id,
		status: 'destroyed',
		delreason: 'destroyed'
	}
}

E621API.prototype.post_show_id = async function(post_id){
	check.is_number(post_id);
	
	return this._add_to_queue({
		path: '/post/show',
		method: 'GET',
		type: 'json',
		searchParams: {
			'id': post_id
		}
	}).catch(e => {
		if(e == 404){ return destroyed_post_response(post_id); }
		throw e;
	});
}

E621API.prototype.post_show_md5 = async function(post_md5){
	check.is_md5sum(post_md5);

	return this._add_to_queue({
		path: '/post/show',
		method: 'GET',
		type: 'json',
		searchParams: {
			'md5': post_md5
		}
	}).catch(e => {
		if(e == 404){ return destroyed_post_response(post_id); }
		throw e;
	});
}

E621API.prototype.post_check = async function(md5){
	check.is_md5sum(md5);
	
	return this._add_to_queue({
		path: '/post/check_md5',
		method: 'GET',
		type: 'json',
		searchParams: {
			'md5': md5
		}
	});
}

/*
Deleted posts still count towards the number of posts returned in page
requests if 'status:any' or 'status:deleted' is part of the tags search
criteria. Deleted posts are not returned either way.
Sorting results with 'order:' using tags does nothing in conjunction
with before_id.                                                            */
E621API.prototype.post_list = async function(options = {}){
	if(typeof options == 'string'){
		// a nice feature for quick searches
		// but do not plan on adding more to this
		const tags = options;
		options = {};
		options.tags = tags;
	}

	check.is_object(options);

	options.limit = options.limit || 320;
	options.tags = options.tags || '';
	// options.before_id   <int>
	// options.page        <int>
	// options.typed_tags  <boolean>

	check.is_number(options.limit);
	check.is_string(options.tags);
	check.is_undefined_or(check.is_number, options.before_id);
	check.is_undefined_or(check.is_number, options.page);
	check.is_undefined_or(check.is_boolean, options.typed_tags);

	return this._add_to_queue({
		path: '/post/index',
		method: 'GET',
		type: 'json',
		searchParams: options
	});
}

E621API.prototype.post_tags_id = async function(post_id){
	check.is_number(post_id);

	return this._add_to_queue({
		path: '/post/tags',
		method: 'GET',
		type: 'json',
		searchParams: {
			'id': post_id
		}
	});
}

E621API.prototype.post_tags_md5 = async function(post_md5){
	check.is_md5sum(post_md5);

	return this._add_to_queue({
		path: '/post/tags',
		method: 'GET',
		type: 'json',
		searchParams: {
			'md5': post_md5
		}
	});
}

E621API.prototype.post_deleted_index = async function(options = {}){
	if(typeof options == 'number'){
		const page = options;
		options = {};
		options.page = page;
	}
	// options.page    <int>
	// options.user_id <int>
	
	check.is_object(options);
	check.is_number(options.page);
	check.is_undefined_or(check.is_number, options.user_id);

	return this._add_to_queue({
		path: '/post/deleted_index',
		method: 'GET',
		type: 'json',
		searchParams: options
	});
}

E621API.prototype.post_popular = async function(){
	// not recommended
	return;
}

E621API.prototype.post_create = async function(){
	// post request
	return;
}

E621API.prototype.post_update = async function(){
	// post request
	return;
}

E621API.prototype.post_vote = async function(){
	// post request
	return;
}

E621API.prototype.post_flag = async function(){
	// post request
	return;
}

E621API.prototype.post_destroy = async function(){
	// post request
	// janitor+ only
	return;
}

E621API.prototype.post_revert_tags = async function(){
	// post request
	// not recommended
	return;
}



E621API.prototype.tag_list = async function(options = {}){
	
	check.is_object(options);

	options.limit = options.limit || 500;
	options.page = options.page || 1;
	options.show_empty_tags = options.show_empty_tags ? 1 : 0;
	// options.order <enum 'date', 'count', 'name'>
	// options.after_id <int>
	// options.name <sting>
	// options.name_pattern <string>

	check.is_number(options.limit);
	check.is_number(options.page);
	check.is_undefined_or(check.is_string, options.order); // todo check values
	check.is_undefined_or(check.is_number, options.after_id);
	check.is_undefined_or(check.is_number, options.show_empty_tags); // todo check 1 or 0
	check.is_undefined_or(check.is_string, options.name);
	
	// name_pattern seems to be disabled. see forum #246758
	if(options.name_pattern){ throw 'feature disabled see forum #246758'; }

	return this._add_to_queue({
		path: '/tag/index',
		method: 'GET',
		type: 'json',
		searchParams: options
	});
}

E621API.prototype.tag_show = async function(tag_id){
	check.is_number(tag_id);

	return this._add_to_queue({
		path: '/tag/show',
		method: 'GET',
		type: 'json',
		searchParams: {
			'id': tag_id
		}
	}).catch(e => {
		if(e == 404){ return {id: tag_id}; }
		throw e;
	});
}

// This looks like it is a feature that requires authentication
// [5:09 AM] Kira: It needs authentication at this time.
E621API.prototype.tag_related = async function(options = {}){
	if(typeof options == 'string'){
		const tags = options;
		options = {};
		options.tags = tags;
	}

	if(Array.isArray(options)){
		const tags = options;
		options = {}
		options.tags = tags.join(' ');
	}

	check.is_object(options);

	if(Array.isArray(options.tags)){
		options.tags = options.tags.join(' ');
	}

	// options.tags <string of tags seperated by spaces>
	// options.type <enum 'general', 'artist', 'copyright', 'character', 'species'>

	check.is_string(options.tags);
	check.is_undefined_or(check.is_string, options.type);

	return this._add_to_queue({
		path: '/tag/related',
		method: 'GET',
		type: 'json',
		searchParams: options
	});
}

E621API.prototype.tag_update = async function(){
	// post request
	return;
}



E621API.prototype.tag_alias = async function(options = {}){
	if(typeof options == 'string'){
		const query = options;
		options = {};
		options.query = query;
	}

	check.is_object(options);

	options.page = options.page || 1;
	options.query = options.query || options.aliased_to || '';
	delete options.aliased_to;
	options.approved = ss(options.approved, 'false', 'all', 'true');
	options.forum_post = ss(options.forum_post, 'false', 'all', 'true');
	// options.order <enum 'tag', 'aliasedtag', 'reason', 'user', 'date', 'forum_post'>
	// options.user <string>

	check.is_number(options.page);
	check.is_string(options.query);
	check.is_undefined_or(check.is_string, options.order)
	check.is_undefined_or(check.is_string, options.user)

	return this._add_to_queue({
		path: '/tag_alias/index',
		method: 'GET',
		type: 'json',
		searchParams: options
	});
}

module.exports = E621API;

require('./extras.js');