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

	findJavaScriptFile: function(filePaths, componentMainFile) {
		//find all .js-files, and exclude the minified versions
		filePaths.forEach(function(path) {
			if(path.endsWith(componentMainFile)) {
				if(!path.includes("dist")) {
					foundJsFiles.push(path);
				}
			}
		});

		return foundJsFiles;
	}
};
