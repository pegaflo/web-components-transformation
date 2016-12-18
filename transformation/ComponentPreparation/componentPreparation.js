let dir = require('node-dir');
let fs = require('fs');
let esprima = require('esprima');
let pathLib = require('path');
let rootDirectory = require('app-root-dir').get();
let copy = require('copy');

let foundJsFiles = [];

module.exports = {

	getComponentsFilePaths : function(componentDirectory, callback) {
		dir.paths(__dirname + "/../../" + componentDirectory, true, function(err, paths) {
		    if (err) throw err;
			console.log("All Files from the given component Path determined");
			callback(paths);
		});
	},

	getPolymerFilePath: function(componentName, callback) {
		dir.paths(__dirname + "/../../", true, function(err, paths) {
			let polymerPaths = [];
			if (err) throw err;
			paths.forEach(function(path) {
				if(path.endsWith("polymer.html")) {
					console.log("Relative Path to the Polymer library determined");
					if(path.indexOf("dist") === -1) {
						polymerPaths.push(path);
					}
				}
			});

			callback(module.exports.processFilePath(polymerPaths[0], componentName));
		})
	},

	getFrameworkPaths: function(detectedComponentType, componentName,  callback) {
		if (detectedComponentType === 'jquery-ui' || detectedComponentType === 'jquery') {
			let foundPaths = [];
			dir.paths(__dirname + "/../../", true, function(err, paths) {
				if (err) throw err;
				let jQueryPath = [];
				paths.forEach(function(path) {
					if (path.endsWith("/jquery.js")) {
						jQueryPath.push(path);
					}
				});
				foundPaths.push(module.exports.processFilePath(jQueryPath[0], componentName));
				if(detectedComponentType === 'jquery-ui') {
					paths.forEach(function(path) {
						if (path.endsWith("/jquery-ui.js")) {
							foundPaths.push(module.exports.processFilePath(path, componentName));
						}
					});
				}
				console.log("Relative Path to the needed Frameworks determined");
				callback(foundPaths);
			});
		}
	},

	/**
	* extract alö possible file path from the Component Framework
	* used by some components, when they are extend a existing component
	* will take only the first path
	*
	* returns the path to the style file
	*/
	getFrameworkStylePaths: function(detectedComponentType, componentName, callback) {
		if (detectedComponentType == 'jquery-ui') {
			let foundPaths = [];
			dir.paths(__dirname + "/../../", true, function(err, paths) {
				if (err) throw err;
				let stylePath = [];
				paths.forEach(function(path) {
					if (path.endsWith("jquery-ui.css")) {
						stylePath.push(path);
					}
				});
				foundPaths.push(module.exports.processFilePath(stylePath[0], componentName));
				console.log("Relative Path to the Style Definition File of the Framewok determined");
				callback(foundPaths);
			});
		} else {
			callback([]);
		}
	},

	parseJavaScriptFile: function(path, callback) {
		console.log(path);
		fs.readFile(path, 'utf8', function (err,data) {
		  if (err) throw err;
		  console.log("JavaScript File is parsed");
		  callback(esprima.parse(data, {loc: true, range: true, tokens: true, tolerant: true, ecmaFeatures: {jsx: true,}}));
		});
	},

	findJavaScriptFile: function(filePaths, componentMainFile) {
		//find all .js-files, and exclude the minified versions
		filePaths.forEach(function(path) {
			if(path.endsWith("/" + componentMainFile)) {
				foundJsFiles.push(path);
				console.log("JavaScript File with the component definition found");
			}
		});
		return foundJsFiles;
	},

	processFilePath: function(path, componentName) {
		//copy(path, rootDirectory + "/dist/" + componentName + "/", function(err, files) {
			//console.log(files + " copied to the component folder")
		//});

		return pathLib.relative(rootDirectory + "/dist/component/", path);
		//return pathLib.relative(rootDirectory + "/dist/" + componentName, path);
	}
};
