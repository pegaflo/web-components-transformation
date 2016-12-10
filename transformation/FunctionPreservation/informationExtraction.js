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

	generateAttributeChangedFunction: function(properties, functions, creationFunction, detectedComponentType) {
		return synchronise.createAttributeChangedFunction(properties, functions, creationFunction, detectedComponentType);
	},

	generateCreationFunction: function(properties, functions, creationFunction, detectedComponentType, templateObject) {
		return synchronise.generateCreationFunction(properties, functions, creationFunction, detectedComponentType, templateObject);
	},

	getCreationFunction: function(analysisResult, detectedComponentType) {
		return extractFunction.extractCreationFunction(analysisResult, detectedComponentType);
	},

	postProcessProperties: function(properties) {
		return extractProperties.postProcess(properties);
	}
}
