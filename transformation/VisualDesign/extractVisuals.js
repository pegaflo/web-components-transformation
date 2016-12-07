let extractStyles = require("./extractStyles.js")
let extractTemplate = require("./extractTemplate.js");

module.exports = {

	extractVisuals: function(componentName, filepath) {
		extractStyles.getVisualRules(componentName, filepath);
	},

	extractTemplate: function(analysisResult, detectedComponentType) {
		extractTemplate.getTemplate(analysisResult, detectedComponentType);
	}
}
