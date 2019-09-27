import { raw_post_show_id, raw_post_show_md5 } from './raw_post_show.js';
import {
	deleted_file,
	deleted_image,
	anonymous_user,
	destroyed_post
} from './../sentinel_values.js';

async function post_show (func, post_id) {
	try {
		const data = await func(post_id);
		return transform_post(data);
	} catch (e) {
		// Do better error handling for other cases
		const has_code = e && e.response && e.response.status;
		const status_code = has_code ? e.response.status : null;
		if (status_code === 404) {
			return destroyed_post;
		} else {
			throw e;
		}
	}
}

async function post_show_id (post_id) {
	return post_show(raw_post_show_id.bind(this), post_id);
}

async function post_show_md5 (post_id) {
	return post_show(raw_post_show_md5.bind(this), post_id);
}

function transform_post (raw_data) {
	return {
		post_id: raw_data.id,
		instance_id: raw_data.change,

		// Partial user
		creator: extract_user(raw_data),
		created_at: fix_date(raw_data.created_at),

		// Reason the post was flagged. Is undefined if the post
		// has never been flagged, otherwise it is a string.
		flag_reason: replace(raw_data.delreason, ''),
		status: raw_data.status,

		tags: replace(raw_data.tags, '')
			.split(' '),
		sources: replace(raw_data.sources, []),
		description: replace(raw_data.description, ''),
		rating: extract_rating(raw_data),

		favorites: replace(raw_data.fav_count, 0),
		score: replace(raw_data.score, 0),

		// Find a better place for these
		has_notes: !!raw_data.has_notes,
		has_comments: !!raw_data.has_comments,

		parent: raw_data.parent_id,
		children: replace(raw_data.children, '')
			.split(',')
			.filter(e => e.length > 0)
			.map(e => parseInt(e, 10)),

		file: extract_file(raw_data),
		image: extract_image(raw_data, 'full'),
		sample: extract_image(raw_data, 'sample'),
		preview: extract_image(raw_data, 'preview')
	};
}

function extract_rating (raw_data) {
	switch (raw_data.rating) {
		case 'e': return 'explicit';
		case 'q': return 'questionable';
		case 's': return 'safe';

		// Default case does not happen
		default: return 'unknown';
	}
}

function extract_file (raw_data) {
	if (raw_data.status === 'deleted') {
		return deleted_file;
	}

	return {
		md5: raw_data.md5,
		size: raw_data.file_size,
		type: raw_data.file_ext
	};
}

// Todo, make this more functional
function extract_image (raw_data, type) {
	if (raw_data.status === 'deleted') {
		return deleted_image;
	}

	if (type === 'full') {
		type = '';
	} else {
		type += '_';
	}

	return {
		url: raw_data[`${type || 'file_'}url`],
		width: raw_data[`${type}width`],
		height: raw_data[`${type}height`]
	};
}

function extract_user (raw_data) {
	if (raw_data.creator_id === null) {
		return anonymous_user;
	} else {
		return {
			name: raw_data.author,
			id: raw_data.creator_id
		};
	}
}

// Takes in a date object as returned by e621
// and converts to a proper javascript date
function fix_date (created_at) {
	const seconds = created_at.s * 1000;
	const nano_seconds = created_at.n / 1000000000;
	return new Date(seconds + nano_seconds);
}

function replace (value, default_value) {
	return (value === undefined || value === null) ? default_value : value;
}

export { post_show_id, post_show_md5 };
