const deleted_file = {
	md5: '4c9de9799beb45b0cae52cac37445098',
	size: 13582,
	type: 'png'
};

const deleted_image = {
	url: 'https://e621.net/images/deleted-preview.png',
	width: 150,
	height: 150
};

const anonymous_user = {
	name: 'The dog in your guitar',
	id: 1
};

const destroyed_post = {
	post_id: -1,
	instance_id: -1,

	creator: anonymous_user,
	created_at: new Date(0),

	flag_reason: '',
	status: 'destroyed',

	tags: [],
	sources: [],
	description: '',
	rating: 'explicit',

	favorites: 0,
	score: 0,

	// Find a better place for these
	has_notes: false,
	has_comments: false,

	parent: null,
	children: [],

	file: deleted_file,
	image: deleted_image,
	sample: deleted_image,
	preview: deleted_image
};

export {
	deleted_image,
	deleted_file,
	anonymous_user,
	destroyed_post
};
