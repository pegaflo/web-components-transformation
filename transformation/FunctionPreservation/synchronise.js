module.exports = {

	generateSynchronizeFunction: function(properties, functions) {
		let attrChanged = module.exports.createAttributeChangedFunction(properties, functions);
		return attrChanged;
	},

	createAttributeChangedFunction: function(properties, functions) {
		let attrFunction;

		attrFunction = "attributeChanged: function(attribute, oldValue, newValue) {";

		properties.forEach(function(prop) {
			//console.log(prop);

			attrFunction += "if(attribute === '" + prop.name + "') {";
			attrFunction += "this." + prop.name + " = newValue;";
			attrFunction += "}";
		});
		attrFunction += "}";

		return attrFunction;
	}

}
