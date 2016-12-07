let estraverse = require("estraverse");

module.exports = {

	extractProperties: function(analysisResult, detectedComponentType) {
		let foundProperties;
		let prop = [];

		estraverse.traverse(analysisResult, {
			enter: function(node, parent) {
				if(detectedComponentType == "jquery") {
					if(node.type == "Property") {
						if(node.value.properties !== undefined) {
							foundProperties = node.value.properties;
						}
					}
				}
			}
		});

		foundProperties.forEach(function(propertyObject) {
			prop.push({
				"name": propertyObject.key.name,
				"default": module.exports.getDefaultValue(propertyObject, detectedComponentType),
				"dataType": module.exports.getDataType(module.exports.getDefaultValue(propertyObject, detectedComponentType), detectedComponentType)
			});
		});

		return prop;
	},

	getDefaultValue: function(propertyObject, detectedComponentType) {
		if(detectedComponentType == "jquery") {
			if(propertyObject.value.type === "ArrayExpression") {
				let arrayValues = [];
				propertyObject.value.elements.forEach(function (data) {
					arrayValues.push(data.value);
				});
				return arrayValues;
			} else {
				return propertyObject.value.value;
			}
		}

	},

	getDataType: function(value, detectedComponentType) {
		if(value instanceof Array) {
			return "Array";
		} else if( value instanceof Date) {
			return "Date";
		} else {
			return typeof value;
		}
	},

	postProcess: function() {

	}
}
