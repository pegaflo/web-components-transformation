var fs = require("fs");
var util = require('util');

module.exports = {
	writeComponentFile: function(componentName, detectedComponentType, properties, synchronizeFunction, visualFile, template, creationFunction) {
		var stream = fs.createWriteStream("./dist/component/" + componentName + ".html");
		stream.once('open', function(fd) {
			stream.write(detectedComponentType + '\n');
			stream.write(properties + '\n');
			stream.write(synchronizeFunction + '\n');
			stream.write(visualFile + '\n');
			stream.write(template + '\n');
			stream.write(creationFunction + '\n');
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
