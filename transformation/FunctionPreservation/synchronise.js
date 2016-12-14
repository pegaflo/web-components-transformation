let estraverse = require('estraverse');

module.exports = {

	createAttributeChangedFunction: function(properties, functions, creationFunction, detectedComponentType) {
		let attrFunction;
		attrFunction = "\t\t\t\t\tattributeChanged: function(attribute, oldValue, newValue) {\n";

		/*properties.forEach(function(prop) {
			attrFunction += "\t\t\t\t\t\tif(attribute === '" + prop.name + "') {\n";
			attrFunction += "\t\t\t\t\t\t\tthis." + prop.name + " = newValue;\n";
			attrFunction += "\t\t\t\t\t\t}\n";
		});*/

		//create a new instance of the component with the updated values
		if (detectedComponentType === "jquery-ui" || detectedComponentType === "jquery") {
			attrFunction += "\t\t\t\t\t\telement." + creationFunction + "({\n";
			properties.forEach(function(value, idx, array) {
				attrFunction += "\t\t\t\t\t\t\t" + value.name + ": this." + value.name;
				if (idx !== array.length - 1){
					attrFunction += ",";
				}
			attrFunction += "\n";
			});
			attrFunction +="\t\t\t\t\t\t});\n";
		}

		attrFunction += "\t\t\t\t\t}\n";

		console.log("Function to react to Attribute Change created");
		return attrFunction;
	},

	/*
	* generate the Component in the ready-Lifecycle-Callback
	* call the component creation on the div-element in the template which will
	* be there if jQuery is used
	*
	* Here are changes necessary if any other component framework should be supported
	*/
	generateCreationFunction: function(properties, functions, creationFunction, detectedComponentType, templateObject, changeTriggers) {
		let generatedCreationFunction;
		generatedCreationFunction = "\t\t\t\t\tready: function() {\n";

		if(detectedComponentType == "jquery-ui" || detectedComponentType === "jquery") {
			generatedCreationFunction += templateObject[0].importNode;
			generatedCreationFunction += "\t\t\t\t\t\telement = $(this.$.entry.children);\n";
			generatedCreationFunction += "\t\t\t\t\t\tlet that = this;\n"
			generatedCreationFunction += "\t\t\t\t\t\telement." + creationFunction + "({\n";
			properties.forEach(function(value, idx, array) {
				generatedCreationFunction += "\t\t\t\t\t\t\t" + value.name + ": this." + value.name;
				if (idx !== array.length - 1){
					generatedCreationFunction += ",";
				}
			generatedCreationFunction += "\n";
			});
			changeTriggers.forEach(function(value, idx, array) {
				if (idx === 0) {
					generatedCreationFunction +="\t\t\t\t\t\t})";
				}

				generatedCreationFunction += ".on('" + value.trigger + "', function(event, attr) {\n";
				generatedCreationFunction += "\t\t\t\t\t\t\tthat." + value.property + " = attr;\n";

				if (idx !== array.length - 1){
					generatedCreationFunction += "\t\t\t\t\t\t})";
				}
			});

			generatedCreationFunction += "\t\t\t\t\t\t});\n";
		}
		generatedCreationFunction += "\t\t\t\t\t},\n";
		console.log("Function to instantiate Component created");
		return generatedCreationFunction;

	},

	/**
	* for jQuery-only
	*/
	getAllChangeTrigger: function(analysisResult, properties, callback) {
		let foundTriggers = []
		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if (node.type == "MemberExpression") {
					// these are that functions, that are called after a point (e.g. this.FUNCTION)
					if (node.property.name === "trigger" || node.property.name === "_trigger") {
						parent.arguments.forEach(function(data) {
							if(data.value !== undefined && data.value.indexOf("change") !== -1) {
								let foundProperty = data.value.split(".")[1];
								if (foundProperty !== undefined) {
									foundTriggers.push({"trigger": data.value, "property": foundProperty});
								}
							}
						})
					}
				}
			}
		});
		console.log("All change-Triggers of the component extracted");
		callback(foundTriggers);
	}



}
