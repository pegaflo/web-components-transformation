let returnValue = [];

module.exports = {

	getTemplate: function(analysisResult, detectedComponentType, componentName) {
		let templateDefinition;
		let importNodeFunction;

		templateDefinition = "<template>";

		// there is no template defined in jquery component files, so we import the nodes, that are given in the new component tag
		if(detectedComponentType == "jquery") {
			// define an entry point, where the node will be imported
			templateDefinition += "<div id='entry'></div>";

			//prepare importNode-Function to copy the template, that is defined while using the component
			importNodeFunction = "var templateNodes = document.getElementsByTagName('" + componentName +"')[0].__dom.childNodes;";
			importNodeFunction += "for(let node of templateNodes) {"
			importNodeFunction += "this.$.entry.appendChild(document.importNode(node, true));"
			importNodeFunction += "}";
			returnValue.push({"importNode": importNodeFunction});
		} else {
			return null;
		}

		templateDefinition += "</template>";
		returnValue.push({"template": templateDefinition});

		return returnValue;
	}

}
