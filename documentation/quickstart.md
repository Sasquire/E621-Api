# Quickstart

```javascript
// import the library some way.

// When making a userscript use a '@require'
// statement with the e621_API.userscript.js file
// https://www.tampermonkey.net/documentation.php#_require

// If you are using nodejs, use the 'require()` function

// Username and api_key are optional, but to get around issues seeing
// certain posts it is recommended to always authenticate your requests
const e621 = new E621API('Example useragent', /* 'username', 'api_key' */);

// See the response of a post from e621
e621.post_show(1907969).then(console.log);

// Iterate over all the posts in a search
async function create_tag_histogram () {
	const histogram = {};
	const search = e621.post_search_iterator('rating:s soft');
	for await (const post of search) {
		Object.values(post.tags)
			.reduce((acc, e) => acc.concat(e))
			.forEach(tag => (histogram[tag] = (histogram[tag] || 0) + 1));
	}
	console.log(histogram);
}

create_tag_histogram();

// Upvote all posts in a search
async function upvote_search (search) {
	for await (const post of e621.post_search_iterator(search)) {
		e621.post_vote(post.id, 'up');
	}
}
```