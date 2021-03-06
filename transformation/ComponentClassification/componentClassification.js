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
			detectedComponentType = module.exports.analyzePackageJSON(path_to_package_json, analysisResult, function(componentType) {
				callback(componentType);
			});
		} else {
			detectedComponentType = module.exports.analyzeFilesForCreationFunction(analysisResult, function(componentType) {
				callback(componentType)
			});
		}
	},

	analyzePackageJSON: function(path, analysisResult, callback) {
		readJson(path, console.error, false, function (er, data) {
			if (er) {
				return;
			}
			//check if one of the supported Frameworks is written in this package.json
			// is written in the keywords or the dependencies, search for a string
			if (data.keywords !== undefined) {
				if (data.keywords.indexOf("jquery") !== -1) {
					detectedComponentType = "jquery";
				}
				if (data.keywords.indexOf("jquery-ui") !== -1 || data.keywords.indexOf("jqueryui") !== -1) {
					detectedComponentType = "jquery-ui";
				} else {
					// when there is no jquery-ui in the package,json, then it is not ensured that there is no jquery-ui library somewhere in the component folder
					// so to be sure, analyze also the Component File
					module.exports.analyzeFilesForCreationFunction(analysisResult, function(type) {
						detectedComponentType = type;
					});
				}
			} else if (data.dependencies !== undefined) {
				if (data.dependencies.jquery !== undefined) {
					detectedComponentType = "jquery";
				}
				if (data.dependencies["jquery-ui"] !== undefined) {
					detectedComponentType = "jquery-ui";
				} else {
					// when there is no jquery-ui in the package,json, then it is not ensured that there is no jquery-ui library somewhere in the component folder
					// so to be sure, analyze also the Component File
					module.exports.analyzeFilesForCreationFunction(analysisResult, function(type) {
						detectedComponentType = type;
					});
				}

			} else {
				// when there is no jquery-ui in the package,json, then it is not ensured that there is no jquery-ui library somewhere in the component folder
				// so to be sure, analyze also the Component File
				module.exports.analyzeFilesForCreationFunction(analysisResult, function(type) {
					detectedComponentType = type;
				});
			}

			console.log("Component Type is detected from package.json. Detected Component Type: " + detectedComponentType);
			callback(detectedComponentType);
		});
	},

	analyzeFilesForCreationFunction: function(analysisResult, callback) {
		let extractedMemberExpressionProperties = [];
		let jQueryUIFound = false;
		let jQueryFound = false;

		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if (node.type == "MemberExpression") {
					// these are that functions, that are called after a point (e.g. this.FUNCTION)
					extractedMemberExpressionProperties.push(node.property);
				}
			}
		});

		extractedMemberExpressionProperties.forEach(function(value) {
			if(value.name === "widget") {
				jQueryUIFound = true;
			} else if (value.name === "fn") {
				jQueryFound = true;
			}
		});
		if (jQueryUIFound) {
			detectedComponentType = "jquery-ui";
		} else if (jQueryFound) {
			detectedComponentType = "jquery";
		} else {
			detectedComponentType = "n/a";
		}
		console.log("Component Type is detected from analysis of the creation function. Detected Component Type: " + detectedComponentType);
		callback(detectedComponentType);
	}
}
