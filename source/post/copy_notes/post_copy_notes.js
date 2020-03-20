const { raw_post_copy_notes } = require('./raw_post_copy_notes.js');

async function post_copy_notes (post_id, to_id) {
	return raw_post_copy_notes.call(this, {
		id: post_id,
		other_post_id: to_id
	});
}

export { post_copy_notes };
