let estraverse = require("estraverse");

module.exports = {

	extractProperties: function(analysisResult, detectedComponentType) {
		let processedProperties = [];

		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if(detectedComponentType === "jquery-ui") {
					if(node.type === "Property" && node.key.name === "options") {
						//console.log(node.key.name);
						if(node.value.properties !== undefined) {
							processedProperties =  module.exports.processProperties(node.value.properties, detectedComponentType);
						}
					}
				} else if (detectedComponentType === "jquery") {
					if(node.type === "ObjectExpression" && parent.left !== undefined) {
						if (parent.operator === "=" && parent.left.property !== undefined && parent.left.property.name === "defaults") {
							if (node.properties !== undefined) {

								processedProperties =  module.exports.processProperties(node.properties, detectedComponentType);
							}
						}
					} else if (node.type === "VariableDeclarator") {
						if (node.id !== undefined && node.id.name === "defaults") {
							if (node.init !== null) {
								processedProperties =  module.exports.processProperties(node.init.properties, detectedComponentType);
							}
						}
					}
				}
			}
		});

		return processedProperties;
		//return module.exports.processProperties(foundProperties, detectedComponentType);
	},

	processProperties: function(foundProperties, detectedComponentType) {
		let prop = [];
		foundProperties.forEach(function(propertyObject) {
			prop.push({
				"name": propertyObject.key.name,
				"default": module.exports.getDefaultValue(propertyObject, detectedComponentType),
				"dataType": module.exports.getDataType(module.exports.getDefaultValue(propertyObject, detectedComponentType))
			});
		});
		return prop;
	},

	getDefaultValue: function(propertyObject, detectedComponentType) {
		if(detectedComponentType === "jquery-ui" || detectedComponentType === "jquery") {
			if(propertyObject.value.type === "ArrayExpression") {
				let arrayValues = [];
				propertyObject.value.elements.forEach(function (data) {
					arrayValues.push(data.value);
				});
				return arrayValues;
			} else if(propertyObject.value.type === "NewExpression" && propertyObject.value.callee.name === "Date") {
				//return propertyObject.value.callee.name;
				return new Date();
			} else {
				let defaultValue = propertyObject.value.value;
				if(defaultValue === undefined) {
					defaultValue = "";
				}
				return defaultValue;
			}
		}

	},

	getDataType: function(value) {
		if(value instanceof Array) {
			return "Array";
		} else if( value instanceof Date) {
			return "Date";
		} else {
			let dataType = typeof value;
			if(dataType === "undefined") {
				dataType = "object";
			}
			return dataType;
		}
	},

	/*
	* transform the extracted properties, standard values and datatypes in a structure
	* for the usage in the component file with the web components library Polymer
	*
	* returns a properties object with all values and a special value to reflectToAttribute
	*/
	postProcess: function(properties) {
		let transformedProps = "\t\t\t\t\tproperties: {\n";

		for(let value of properties) {
			transformedProps += "\t\t\t\t\t\t" + value.name + ":{\n";
			transformedProps += "\t\t\t\t\t\t\ttype: " + module.exports.capitalizeFirstLetter(value.dataType) + ",\n";
			transformedProps += "\t\t\t\t\t\t\tvalue: " + JSON.stringify(value.default) + ",\n";
			transformedProps += "\t\t\t\t\t\t\treflectToAttribute: true\n";
			transformedProps += "\t\t\t\t\t\t},\n"; //TODO: last iteration without comma
		}
		transformedProps += "\t\t\t\t\t},\n";
		return transformedProps;
	},

	capitalizeFirstLetter: function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}
}
