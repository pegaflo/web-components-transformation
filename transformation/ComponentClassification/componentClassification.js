let estraverse = require("estraverse");
let readJson = require('read-package-json');

let detectedComponentType;

module.exports = {
	analyzeComponentType: function(filePaths, analysisResult, callback) {
		let package_json_found = false;
		let path_to_package_json;
		filePaths.forEach(function(path) {
			if(path.indexOf("package.json") !== -1) {
				package_json_found = true;
				path_to_package_json = path;
			}
		});

		if(package_json_found === true) {
			detectedComponentType = module.exports.analyzePackageJSON(path_to_package_json, function(componentType) {
				callback(componentType);
			});
		} else {
			detectedComponentType = module.exports.analyzeFilesForCreationFunction(analysisResult, function(componentType) {
				callback(componentType)
			});
		}
	},

	//analyzeFilesForCreationFunction: function(filePaths) {
		//search for a creation function in the javaSScruotFiles
	//},

	analyzePackageJSON: function(path, callback) {
		readJson(path, console.error, false, function (er, data) {
			if (er) {
				return;
			}
			//check if one of the supported Frameworks is written in this package.json
			// is written in the keywords or the dependencies, search for a string
			if(data.keywords.indexOf("react") !== -1 ||
					data.dependencies.react !== undefined) {
				detectedComponentType = "react";
			}
			else if(data.keywords.indexOf("jquery") !== -1 ||
					data.dependencies.jquery !== undefined) {
				detectedComponentType = "jquery"
			}
			callback(detectedComponentType);
		});
	},

	analyzeFilesForCreationFunction: function(analysisResult, callback) {
		let extractedMemberExpressionProperties = [];
		let jQueryFound = false;

		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if(node.type == "MemberExpression") {
					// these are that functions, that are called after a point (e.g. this.FUNCTION)
					extractedMemberExpressionProperties.push(node.property);
				}
			}
		});

		extractedMemberExpressionProperties.forEach(function(value) {
			if(value.name === "widget") {
				jQueryFound = true;
			}
		});
		if(jQueryFound) {
			detectedComponentType = "jquery";
		} else {
			detectedComponentType = "n/a";
		}
		callback(detectedComponentType);
	}
}
