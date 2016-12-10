let returnValue = [];

module.exports = {

	getTemplate: function(analysisResult, detectedComponentType, componentName) {
		let templateDefinition;
		let importNodeFunction;

		templateDefinition = "\t<template>\n";

		// there is no template defined in jquery component files, so we import the nodes, that are given in the new component tag
		if(detectedComponentType == "jquery") {
			// define an entry point, where the node will be imported
			templateDefinition += "\t\t<div id='entry'></div>\n";

			//prepare importNode-Function to copy the template, that is defined while using the component
			importNodeFunction = "\t\t\t\t\t\tvar templateNodes = document.getElementsByTagName('" + componentName +"')[0].__dom.childNodes;\n";
			importNodeFunction += "\t\t\t\t\t\tvar nodeId;\n";
			importNodeFunction += "\t\t\t\t\t\tfor(let node of templateNodes) {\n";
			importNodeFunction += "\t\t\t\t\t\t\tif(node.id !== undefined) {\n";
			importNodeFunction += "\t\t\t\t\t\t\t\tnodeId = node.id;\n"
			importNodeFunction += "\t\t\t\t\t\t\t}\n"
			importNodeFunction += "\t\t\t\t\t\t\tthis.$.entry.appendChild(document.importNode(node, true));\n";
			importNodeFunction += "\t\t\t\t\t\t}\n";
		} else {
			return null;
		}

		templateDefinition += "\t</template>\n";
		returnValue.push({"templateDefinition": templateDefinition, "importNode": importNodeFunction});

		return returnValue;
	}

}
