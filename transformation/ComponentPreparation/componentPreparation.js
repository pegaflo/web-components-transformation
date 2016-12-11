let dir = require('node-dir');
let fs = require('fs');
let esprima = require('esprima');
let pathLib = require('path');
let rootDirectory = require('app-root-dir').get();

let foundJsFiles = [];

module.exports = {

	getComponentsFilePaths : function(componentDirectory, callback) {
		dir.paths(__dirname + "/../../" + componentDirectory, true, function(err, paths) {
		    if (err) throw err;
			callback(paths);
		});
	},

	getPolymerFilePath: function(callback) {
		dir.paths(__dirname + "/../../", true, function(err, paths) {
			if (err) throw err;
			paths.forEach(function(path) {
				if(path.endsWith("polymer.html")) {
					callback(module.exports.processFilePath(path));
				}
			});
		})
	},

	getFrameworkPaths: function(detectedComponentType, callback) {
		//callback();
		if (detectedComponentType == 'jquery') {
			let foundPaths = [];
			dir.paths(__dirname + "/../../", true, function(err, paths) {
				if (err) throw err;
				paths.forEach(function(path) {
					if (path.endsWith("/jquery/dist/jquery.js")) {
						foundPaths.push(module.exports.processFilePath(path));
					}
				});
				paths.forEach(function(path) {
					if (path.endsWith("jquery-ui.js")) {
						foundPaths.push(module.exports.processFilePath(path));
					}
				});
				callback(foundPaths);
			});
		}
	},

	/**
	* extract the file path to the style file of the used Component Framework
	* used by some components, when they are extend a existing component
	*
	* returns the path to the style file
	*/
	getFrameworkStylePaths: function(detectedComponentType, callback) {
		if (detectedComponentType == 'jquery') {
			let foundPaths = [];
			dir.paths(__dirname + "/../../", true, function(err, paths) {
				if (err) throw err;
				paths.forEach(function(path) {
					if (path.endsWith("jquery-ui.css")) {
						foundPaths.push(module.exports.processFilePath(path));
					}
				});
				callback(foundPaths);
			});
		}
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
	},

	processJavaScriptFile: function(path) {
		return module.exports.processFilePath(path);
	},

	processFilePath: function(path) {
		return pathLib.relative(rootDirectory + "/dist/component/", path);
	}
};
