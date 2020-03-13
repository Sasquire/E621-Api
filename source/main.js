import { raw_post_show } from './post/show/raw_post_show.js';
import { raw_post_search } from './post/search/raw_post_search.js';
import { post_search } from './post/search/post_search.js';
import { raw_post_vote } from './post/vote/raw_post_vote.js';
import { raw_post_create } from './post/create/raw_post_create.js';

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
E621API.prototype.raw_post_search = raw_post_search;
E621API.prototype.post_search = post_search;
E621API.prototype.raw_post_vote = raw_post_vote;
E621API.prototype.raw_post_create = raw_post_create;

export default E621API;
