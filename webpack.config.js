const path = require('path');
const mode = ['development', 'production', 'none'][0];

const dist_folder = path.resolve(__dirname, 'distribution');
const entry = path.join(__dirname, 'source', 'download.js');

const node_config = {
	target: 'node',
	entry: entry,
	mode: mode,
	output: {
		path: dist_folder,
		filename: 'e621_API.node.js'
	}
};

const browser_config = {
	target: 'web',
	entry: entry,
	mode: mode,
	output: {
		path: dist_folder,
		filename: 'e621_API.browser.js'
	}
};

const userscript_config = {
	target: 'web',
	entry: entry,
	mode: mode,
	output: {
		path: dist_folder,
		filename: 'e621_API.userscript.js'
	}
};

module.exports = [
	node_config,
	browser_config,
	userscript_config
];
