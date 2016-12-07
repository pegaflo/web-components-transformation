let functionExtractor = require("function-extractor");
let HashMap = require('hashmap');

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
	}

}
