var fs = require("fs");
var util = require('util');

module.exports = {
	writeComponentFile: function(componentName, detectedComponentType, properties, attributeChangedFunction, creationFunction, visualFile, template, componentMainFile, polymerPath) {
		var stream = fs.createWriteStream("./dist/component/" + componentName + ".html");
		stream.once('open', function(fd) {
			stream.write("<link rel='import' href='" + polymerPath + "'>\n");
			stream.write("<link rel='import' href='" + visualFile + "'>\n");
			stream.write("<script src='" + componentMainFile + "'></script>\n\n");

			stream.write("<dom-module id='" + componentName + "'>\n");
				//stream.write(template[0].template);
				template.forEach(function(value) {
					stream.write(value.templateDefinition);
				});

				stream.write("\t<script>\n");
					if(detectedComponentType == "jquery") {
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

			//stream.write(detectedComponentType + '\n');
			//stream.write(properties + '\n');
			//stream.write(attributeChangedFunction + '\n');
			//stream.write(creationFunction + '\n');
			//stream.write(visualFile + '\n');
			//stream.write(template + '\n');
		  stream.end();
		})
	},

	writeVisualFile: function(componentName, paths, filename) {
		var stream = fs.createWriteStream("./dist/component/" + componentName + "." + filename);
		stream.once('open', function(fd) {

			paths.forEach(function(p) {
				stream.write("<link rel='stylesheet' href='" + p + "' />\n");
			});
		  stream.end();
		})
		//console.log("Style File is written!");

		return "./dist/component/" + componentName + "." + filename;
	},

	debugWriteFile: function(componentName, content) {
		fs.writeFile("./dist/component/debug." + componentName + ".txt", JSON.stringify(content, null, 2), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		});
	}
};
