var extractFunction = require("./extractFunctions.js");
var extractProperties = require("./extractProperties.js");
var synchronise = require("./synchronise.js");

module.exports = {
	getFunctions: function(analysisResult) {
		return extractFunction.extractFunctionDefinition(analysisResult);
	},

	getProperties: function(analysisResult, detectedComponentType) {
		return extractProperties.extractProperties(analysisResult, detectedComponentType);
	},

	generateSynchronizeFunction: function(properties, functions) {
		return synchronise.generateSynchronizeFunction(properties, functions);
	}
}
