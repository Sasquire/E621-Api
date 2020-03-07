import { raw_post_show } from './post/raw_post_show.js';
import { raw_post_list } from './post/raw_post_list.js';
import { raw_post_vote } from './post/raw_post_vote.js';
import { raw_post_create } from './post/raw_post_create.js';

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
E621API.prototype.raw_post_list = raw_post_list;
E621API.prototype.raw_post_vote = raw_post_vote;
E621API.prototype.raw_post_create = raw_post_create;

export default E621API;
