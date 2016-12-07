var fs = require("fs");
var util = require('util');

module.exports = {
	writeComponentFile: function(componentName, paths) {
		var stream = fs.createWriteStream("./dist/component/" + componentName + ".html");
		stream.once('open', function(fd) {

			paths.forEach(function(p) {
				stream.write(p + "\n");
			});
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
	},

	debugWriteFile: function(componentName, content) {
		fs.writeFile("./dist/component/debug." + componentName + ".txt", JSON.stringify(content, null, 2), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		});
	}
};
