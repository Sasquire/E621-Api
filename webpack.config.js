const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const mode = ['development', 'production', 'none'][0];

const dist_folder = path.resolve(__dirname, 'distribution');
const entry = path.join(__dirname, 'source', 'main.js');

// This will replace the `__TARGET__` in imports with the proper type.
// ie. `import foo from 'bar.__TARGET.js'`
// becomes `import foo from 'bar.node.js'`
function create_replacement (target) {
	return new webpack.NormalModuleReplacementPlugin(
		/(.*)__TARGET__(.*)/u,
		(resource) => {
			resource.request = resource.request.replace(/__TARGET__/ug, target);
		}
	);
}

const node_config = {
	target: 'node',
	entry: entry,
	mode: mode,
	plugins: [create_replacement('node')],
	externals: [nodeExternals()],
	output: {
		path: dist_folder,
		filename: 'e621_API.node.js',
		library: 'E621API',
		libraryTarget: 'commonjs2',
		libraryExport: 'default'
	}
};

const browser_config = {
	target: 'web',
	entry: entry,
	mode: mode,
	plugins: [create_replacement('browser')],
	output: {
		path: dist_folder,
		filename: 'e621_API.browser.js',
		library: 'E621API',
		libraryTarget: 'assign',
		libraryExport: 'default'
	}
};

const userscript_config = {
	target: 'web',
	entry: entry,
	mode: mode,
	plugins: [create_replacement('userscript')],
	output: {
		path: dist_folder,
		filename: 'e621_API.userscript.js',
		library: 'E621API',
		libraryTarget: 'assign',
		libraryExport: 'default'
	}
};

const validation_testing_config = {
	target: 'node',
	entry: './source/validation/validation.js',
	mode: 'none',
	plugins: [create_replacement('node')],
	externals: [nodeExternals()],
	output: {
		path: dist_folder,
		filename: 'validation.test.node.js',
		library: 'validation',
		libraryTarget: 'commonjs2'
	}
};

module.exports = [
	node_config,
	browser_config,
	userscript_config,
	validation_testing_config
];
