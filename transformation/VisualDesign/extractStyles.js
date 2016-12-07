//import the FileWriter-Module, because of the function to write the styles-file
var FileWriter = require("../FileWriter/writeFile.js");

//array with all the paths, that are used to design the component
let paths = [];

module.exports = {

	getVisualRules: function(componentName, filepath) {
		//console.log("Path to Style Files will be extracted...");
		filepath.forEach(function(path) {
			if(path.indexOf(".css") !== -1 || path.indexOf(".less") !== -1 ||
					path.indexOf(".scss") !== -1 || path.indexOf(".style") !== -1) {
				paths.push(path);
			}
		});
		//console.log("Path to the Style Files extracted!");

		//console.log("Style File will be written...");
		FileWriter.writeVisualFile(componentName, paths, "styles.html");
	}

}
