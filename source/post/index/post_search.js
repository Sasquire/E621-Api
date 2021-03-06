import { raw_post_search } from './raw_post_search.js';

async function post_search (tag_string, page = 0) {
	return raw_post_search.call(this, {
		limit: 320,
		tags: tag_string,
		page: page.toString()
	}).catch(handle_error);
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { post_search };
