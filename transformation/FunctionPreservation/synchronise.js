module.exports = {

	createAttributeChangedFunction: function(properties, functions, creationFunction, detectedComponentType) {
		let attrFunction;
		attrFunction = "\t\t\t\t\tattributeChanged: function(attribute, oldValue, newValue) {\n";

		properties.forEach(function(prop) {
			//console.log(prop);

			attrFunction += "\t\t\t\t\t\tif(attribute === '" + prop.name + "') {\n";
			attrFunction += "\t\t\t\t\t\t\tthis." + prop.name + " = newValue;\n";
			attrFunction += "\t\t\t\t\t\t}\n";
		});

		//create a new instance of the component with the updated values

		attrFunction += "\t\t\t\t\t\telement." + creationFunction + "({\n";
		properties.forEach(function(value, idx, array) {
			attrFunction += "\t\t\t\t\t\t\t" + value.name + ": this." + value.name;
			if (idx !== array.length - 1){
				attrFunction += ",";
			}
		attrFunction += "\n";
		});
		attrFunction +="\t\t\t\t\t\t});\n";

		attrFunction += "\t\t\t\t\t}\n";

		return attrFunction;
	},

	/*
	* generate the Component in the ready-Lifecycle-Callback
	* call the component creation on the div-element in the template which will
	* be there if jQuery is used
	*
	* Here are changes necessary if any other component framework should be supported
	*/
	generateCreationFunction: function(properties, functions, creationFunction, detectedComponentType, templateObject) {
		let generatedCreationFunction;
		generatedCreationFunction = "\t\t\t\t\tready: function() {\n";

		if(detectedComponentType == "jquery") {
			generatedCreationFunction += templateObject[0].importNode;
			generatedCreationFunction += "\t\t\t\t\t\telement = $('#' + nodeId);\n";
			generatedCreationFunction += "\t\t\t\t\t\tlet that = this;\n"
			generatedCreationFunction += "\t\t\t\t\t\telement." + creationFunction + "({\n";
			properties.forEach(function(value, idx, array) {
				generatedCreationFunction += "\t\t\t\t\t\t\t" + value.name + ": this." + value.name;
				if (idx !== array.length - 1){
					generatedCreationFunction += ",";
				}
			generatedCreationFunction += "\n";
			});
			generatedCreationFunction +="\t\t\t\t\t\t})";

			properties.forEach(function(value, idx, array) {
				generatedCreationFunction += ".on('change." + value.name + "', function(event, attr) {\n";
				generatedCreationFunction += "\t\t\t\t\t\t\tthat." + value.name + " = attr;\n";

				if (idx !== array.length - 1){
					generatedCreationFunction += "\t\t\t\t\t\t})";
				}
			});

			generatedCreationFunction += "\t\t\t\t\t\t});\n";
		}
		generatedCreationFunction += "\t\t\t\t\t},\n";
		return generatedCreationFunction;

	}

}
