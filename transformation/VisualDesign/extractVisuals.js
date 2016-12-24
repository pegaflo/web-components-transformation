let extractStyles = require("./extractStyles.js")
let extractTemplate = require("./extractTemplate.js");

module.exports = {

	extractVisualRules: function(componentPath, filepath, componentName) {
		return extractStyles.getVisualRules(componentPath, filepath, componentName);
	},

	extractTemplate: function(analysisResult, detectedComponentType, componentName) {
		return extractTemplate.getTemplate(analysisResult, detectedComponentType, componentName);
	}
}
