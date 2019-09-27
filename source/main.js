import {
	raw_post_show,
	raw_post_show_id,
	raw_post_show_md5
} from './post/raw_post_show.js';

import {
	post_show_id,
	post_show_md5
} from './post/post_show.js';

class E621API {
	// Any of these can be anything, but errors will be thrown
	// when any requests are trying to be made.
	constructor (useragent, username, api_key) {
		this.useragent = useragent;
		this.username = username;
		this.api_key = api_key;
	}
}

E621API.prototype.raw_post_show = raw_post_show;
E621API.prototype.raw_post_show_id = raw_post_show_id;
E621API.prototype.raw_post_show_md5 = raw_post_show_md5;

E621API.prototype.post_show_id = post_show_id;
E621API.prototype.post_show_md5 = post_show_md5;

export default E621API;
