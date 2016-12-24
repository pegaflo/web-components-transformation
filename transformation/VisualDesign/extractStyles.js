//import the FileWriter-Module, because of the function to write the styles-file
var FileWriter = require("../FileWriter/fileSystemWorker.js");
var componentPreparation = require("../ComponentPreparation/componentPreparation.js");

//array with all the paths, that are used to design the component
let paths = [];

module.exports = {

	getVisualRules: function(componentPath, filepath, componentName) {
		filepath.forEach(function(path) {
			if(path.indexOf(".css") !== -1 || path.indexOf(".less") !== -1 ||
					path.indexOf(".scss") !== -1 || path.indexOf(".style") !== -1) {
				let string = path.substring(0, path.indexOf(componentPath));
				path = path.replace(string, "./component/").replace(componentPath + "/", "");
				paths.push(path);
			}
		});
		console.log("Path to the Style Files extracted!");
		return FileWriter.writeVisualFile(componentName, paths, "styles.html");
	}

}
