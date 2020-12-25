import { tag_search } from './tag_search.js';

const tags_per_page = 1000;

// You can not have a different order when searching through posts like this
async function* tag_search_iterator (search_options) {
	// "Providing arbitrarily large values to obtain the most recent posts
	// is not portable and may break in the future". (wiki)
	// I do what I want
	search_options.page = null;
	search_options.limit = null;

	let max_id = 1e9;
	while (true) {
		// https://github.com/zwagoth/e621ng/issues/202
		const tags = await tag_search.call(this, {
			...search_options,
			page: `b${max_id}`,
			limit: 1000
		}).catch(handle_error);

		yield* tags;
		max_id = tags.reduce((acc, e) => acc.id < e.id ? acc : e).id;

		if (tags.length < tags_per_page) {
			return;
		}
	}
}

function handle_error (error) {
	// Todo
	console.log(error);
	throw error;
}

export { tag_search_iterator };
