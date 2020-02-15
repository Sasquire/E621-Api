const E621API = require('./api.js');

E621API.prototype.$before_id_dense = async function(max_id){
	const posts = await this.post_list({
		before_id: max_id
	}).then(e => e.sort((a, b) => b.id - a.id));
	
	if(posts.length == 0){ return posts; }
	const min_id = posts.slice(-1)[0].id;
	max_id = posts[0].id; // if max_id is very large
	
	const old_ids = posts.map(e => e.id);
	const deleted_posts = await Promise.all(
		new Array((max_id - min_id))
			.fill(min_id)
			.map((e, i) => e + i)
			.filter(e => old_ids.includes(e) == false)
			.map(e => this.post_show_id(e))
	);
	
	return posts.concat(deleted_posts);
}
