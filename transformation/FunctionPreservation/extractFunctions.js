let functionExtractor = require("function-extractor");
let estraverse = require("estraverse");

module.exports = {
	extractFunctionDefinition: function(analysisResult) {
		let functions = functionExtractor.interpret(analysisResult);
		let functionDefinition = [];

		functions.forEach(function(value) {
			let parameters = [];
			value.params.forEach(function(parameter) {
				parameters.push(parameter.name);
			})
			functionDefinition.push({"functionName": value.name, "parameters": parameters})
		});

		return functionDefinition;
	},

	extractCreationFunction: function(analysisResult, detectedComponentType) {
		let creationFunctionName;
		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if (detectedComponentType === "jquery-ui") {
					if(node.type === "MemberExpression" && node.property.name === "widget" && node.object.name === "$") {
							creationFunctionName = parent.arguments[0].value.split(".")[1]
					}
				}
			}
		});

		return creationFunctionName;
	}

}
