let extractStyles = require("./extractStyles.js")
let extractTemplate = require("./extractTemplate.js");

module.exports = {

	extractVisuals: function(componentName, filepath) {
		return extractStyles.getVisualRules(componentName, filepath);
	},

	extractTemplate: function(analysisResult, detectedComponentType, componentName) {
		return extractTemplate.getTemplate(analysisResult, detectedComponentType, componentName);
	}
}
