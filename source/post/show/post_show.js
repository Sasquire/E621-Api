import { raw_post_search } from './../index/raw_post_search.js';
import { raw_post_show } from './raw_post_show.js';
import { validate_md5 } from './../../validation/validation.js';

async function post_show_id (post_id) {
	return raw_post_show.call(this, {
		id: post_id
	}).then(e => e.post);
}

async function post_show_md5 (md5) {
	validate_md5(md5);
	return raw_post_search.call(this, {
		tags: `md5:${md5}`,
		limit: 1,
		page: null
	}).then(e => {
		if (e.posts.length === 0) {
			return null;
		} else {
			return e.posts[0];
		}
	});
}

async function post_show (id_md5) {
	if (typeof id_md5 === 'string' && id_md5.length === 32) {
		return post_show_md5.call(this, id_md5);
	} else {
		return post_show_id.call(this, Number(id_md5));
	}
}

export {
	post_show_id,
	post_show_md5,
	post_show
};
