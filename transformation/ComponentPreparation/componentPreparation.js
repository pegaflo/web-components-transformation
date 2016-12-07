let dir = require('node-dir');
let fs = require('fs');
let esprima = require('esprima');

let foundJsFiles = [];

module.exports = {

	getComponentsFilePaths : function(componentDirectory, callback) {
		dir.paths(__dirname + "/../../" + componentDirectory, true, function(err, paths) {
		    if (err) throw err;
			callback(paths);
		});
	},

	parseJavaScriptFile: function(path, callback) {
		fs.readFile(path, 'utf8', function (err,data) {
		  if (err) throw err;
		  callback(esprima.parse(data, {loc: true, range: true, tokens: true, tolerant: true, ecmaFeatures: {jsx: true,}}));
		});
	},

	findJavaScriptFiles: function(filePaths) {
		//find all .js-files, and exclude the minified versions
		filePaths.forEach(function(path) {
			if((path.endsWith(".js")) && (!path.endsWith(".min.js"))) {
				foundJsFiles.push(path);
			}
		});

		return foundJsFiles;
	}
};
