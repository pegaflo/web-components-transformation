let fs = require("fs");
let mkdirp = require('mkdirp');

let componentPreparation = require('../ComponentPreparation/componentPreparation.js');

module.exports = {
	writeComponentFile: function(componentName, detectedComponentType, properties, attributeChangedFunction, creationFunction, visualFile, template, componentMainFile, polymerPath, frameworkPaths, frameworkStylePath) {
		var stream = fs.createWriteStream("./dist/" + componentName + "/" + componentName + ".html");
		stream.once('open', function(fd) {
			stream.write("<link rel='import' href='./" + polymerPath + "'>\n");
			stream.write("<link rel='import' href='" + visualFile + "'>\n");
			frameworkStylePath.forEach(function(stylePath) {
				stream.write("<link rel='stylesheet' href='./" + stylePath + "'>\n");
			});
			frameworkPaths.forEach(function(path) {
				stream.write("<script src='./" + path + "'></script>\n");
			});

			stream.write("<script src='./" + componentMainFile + "'></script>\n\n");

			stream.write("<dom-module id='" + componentName + "'>\n");
				//stream.write(template[0].template);
				template.forEach(function(value) {
					stream.write(value.templateDefinition);
				});

				stream.write("\t<script>\n");
					// the definition of the polymer component
					if (detectedComponentType === "jquery-ui" || detectedComponentType === "jquery") {
						stream.write("\t\tjQuery.noConflict();\n");
						stream.write("\t\t(function($) {\n");
						stream.write("\t\t\t$(function()  {\n");
						stream.write("\t\t\t\tlet element;\n");

						stream.write("\t\t\t\tPolymer({\n");
						stream.write("\t\t\t\t\tis: '" +  componentName + "',\n");
						stream.write(properties);
						stream.write(creationFunction);
						stream.write(attributeChangedFunction);
						stream.write("\t\t\t\t});\n");

						stream.write("\t\t\t});\n");
						stream.write("\t\t})(jQuery)\n");
					}

				stream.write("\t</script>\n");
			stream.write("</dom-module>");
		  stream.end();
		})
		console.log("Component File with the definition of the Web Component is written");
	},

	writeVisualFile: function(componentName, paths,  filename) {
		var stream = fs.createWriteStream("./dist/" + componentName + "/" + componentName + "." + filename);
		stream.once('open', function(fd) {
			paths.forEach(function(path) {
				stream.write("<link rel='stylesheet' href='" + componentPreparation.processFilePath(path) + "' />\n");
			});
		  stream.end();
		})
		console.log("Style File is written to the output folder");

		return "./" + componentName + "." + filename;
	},

	debugWriteFile: function(componentName, content) {
		fs.writeFile("./dist/" + componentName + "/debug." + componentName + ".txt", JSON.stringify(content, null, 2), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		});
	},

	createComponentFolder: function(componentName, callback) {
		mkdirp('./dist/' + componentName, function (err) {
    		if (err) console.error(err);
			console.log("New Folder in ./dist/ for the Component created");
			callback();
		});
	}
};
