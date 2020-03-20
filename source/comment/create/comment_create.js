const { raw_comment_create } = require('./raw_comment_create.js');

async function comment_create (post_id, text) {
	return raw_comment_create.call(this, {
		'comment[post_id]': post_id,
		'comment[body]': text
	});
}

export { comment_create };
