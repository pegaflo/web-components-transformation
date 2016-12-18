var extractFunction = require("./extractFunctions.js");
var extractProperties = require("./extractProperties.js");
var synchronise = require("./synchronization.js");

module.exports = {
	getFunctions: function(analysisResult) {
		return extractFunction.extractFunctionDefinition(analysisResult);
	},

	getProperties: function(analysisResult, detectedComponentType) {
		return extractProperties.extractProperties(analysisResult, detectedComponentType);
	},

	generateAttributeChangedFunction: function(properties, functions, creationFunction, detectedComponentType) {
		return synchronise.generateAttributeChangedFunction(properties, functions, creationFunction, detectedComponentType);
	},

	generateCreationFunction: function(properties, functions, creationFunction, detectedComponentType, templateObject, changeTriggers) {
		return synchronise.generateCreationFunction(properties, functions, creationFunction, detectedComponentType, templateObject, changeTriggers);
	},

	getCreationFunction: function(analysisResult, detectedComponentType) {
		return extractFunction.extractCreationFunction(analysisResult, detectedComponentType);
	},

	postProcessProperties: function(properties) {
		return extractProperties.postProcess(properties);
	},

	getChangeTrigger: function(analysisResult, properties, callback) {
		return synchronise.getAllChangeTrigger(analysisResult, properties, callback);
	}
}
