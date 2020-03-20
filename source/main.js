import { raw_post_show } from './post/show/raw_post_show.js';
import {
	post_show_id,
	post_show_md5,
	post_show
} from './post/show/post_show.js';

import { raw_post_search } from './post/search/raw_post_search.js';
import { post_search } from './post/search/post_search.js';
import { post_search_iterator } from './post/search/post_search_iterator.js';

import {
	raw_post_vote,
	post_vote_remove
} from './post/vote/raw_post_vote.js';
import {
	post_vote_up,
	post_vote_down
} from './post/vote/post_vote.js';

import { raw_post_create } from './post/create/raw_post_create.js';
import { post_create } from './post/create/post_create.js';

import { raw_post_update } from './post/update/raw_post_update.js';
import { post_update } from './post/update/post_update.js';

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
E621API.prototype.post_show_id = post_show_id;
E621API.prototype.post_show_md5 = post_show_md5;
E621API.prototype.post_show = post_show;

E621API.prototype.raw_post_search = raw_post_search;
E621API.prototype.post_search = post_search;
E621API.prototype.post_search_iterator = post_search_iterator;

E621API.prototype.raw_post_vote = raw_post_vote;
E621API.prototype.post_vote_up = post_vote_up;
E621API.prototype.post_vote_down = post_vote_down;
E621API.prototype.post_vote_remove = post_vote_remove;

E621API.prototype.raw_post_create = raw_post_create;
E621API.prototype.post_create = post_create;

E621API.prototype.raw_post_update = raw_post_update;
E621API.prototype.post_update = post_update;

export default E621API;
