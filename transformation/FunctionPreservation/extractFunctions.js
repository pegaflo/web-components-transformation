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
		console.log("Functions extracted from the parsed JavaScript File");
		return functionDefinition;
	},

	extractCreationFunction: function(analysisResult, detectedComponentType) {
		let creationFunctionName;
		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if (detectedComponentType === "jquery-ui") {
					if (node.type === "MemberExpression" && node.property.name === "widget" && node.object.name === "$") {
							creationFunctionName = parent.arguments[0].value.split(".")[1]
					}
				} else if (detectedComponentType === "jquery") {
					if (node.type === "Identifier") {
						if (parent.object !== undefined  && parent.object.property !== undefined && parent.object.object !== undefined) {
							if (parent.object.object.name === "$" && parent.object.property.name === "fn") {
								creationFunctionName = node.name;
							}
						}
					}
				}
			}
		});
		console.log("Creation Function extracted from the parsed JavaScript File");
		return creationFunctionName;
	}

}
