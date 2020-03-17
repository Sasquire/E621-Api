import { raw_post_vote } from './raw_post_vote.js';

async function post_vote_up (post_id) {
	return raw_post_vote.call(this, {
		post_id: post_id,
		score: 1,
		no_unvote: true
	});
}

async function post_vote_down (post_id) {
	raw_post_vote.call(this, {
		post_id: post_id,
		score: -1,
		no_unvote: true
	});
}

export {
	post_vote_up,
	post_vote_down
};
