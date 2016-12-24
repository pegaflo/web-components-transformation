let fs = require("fs");
let mkdirp = require('mkdirp');
let copydir = require('copy-dir');

let componentPreparation = require('../ComponentPreparation/componentPreparation.js');

module.exports = {
	writeComponentFile: function(componentName, detectedComponentType, properties, attributeChangedFunction, creationFunction, visualFile, template, componentMainFile, frameworkPaths, frameworkStylePath) {
		var stream = fs.createWriteStream("./dist/jquery/" + componentName + "/" + componentName + ".html");
		stream.once('open', function(fd) {
			stream.write("<link rel='import' href='./polymer/polymer.html'>\n");
			stream.write("<link rel='import' href='" + visualFile + "'>\n");

			frameworkStylePath.forEach(function(stylePath) {
				if (stylePath.endsWith("jquery-ui.css")) {
					stream.write("<link rel='stylesheet' href='./framework/jQueryUI/jquery-ui.css'>\n");
				}
			});
			frameworkPaths.forEach(function(path) {
				if (path.endsWith("jquery.js")) {
					stream.write("<script src='./framework/jQuery/jquery.js'></script>\n");
				} else if (path.endsWith("jquery-ui.js")) {
					stream.write("<script src='./framework/jQueryUI/jquery-ui.js'></script>\n");
				}
			});

			stream.write("<script src='./component/" + componentMainFile + "'></script>\n\n");

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
		var stream = fs.createWriteStream("./dist/jquery/" + componentName + "/" + componentName + "." + filename);
		stream.once('open', function(fd) {
			paths.forEach(function(path) {
				stream.write("<link rel='stylesheet' href='" + path + "' />\n");
			});
		  stream.end();
		})
		console.log("Style File is written to the output folder");

		return "./" + componentName + "." + filename;
	},

	debugWriteFile: function(componentName, content) {
		fs.writeFile("./dist/jquery/" + componentName + "/debug." + componentName + ".txt", JSON.stringify(content, null, 2), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		});
	},

	createComponentFolder: function(componentName, callback) {
		mkdirp('./dist/jquery/' + componentName, function (err) {
    		if (err) console.error(err);
			console.log("New Folder in ./dist/ for the Component created");
			callback();
		});
	},

	copyFolders: function(polymerPath, frameworkPath, componentDirectory, componentName, detectedComponentType) {

		let jQueryFolder;
		let jQueryUIFolder;
		let polymerFolder = polymerPath.replace("polymer.html", "").replace("../../", "./");

		console.log(polymerFolder);
		copydir(polymerFolder, './dist/jquery/' + componentName + '/polymer/', function() {});

		frameworkPath.forEach(function (path) {
			if (detectedComponentType === "jquery") {
				jQueryFolder = path.replace("../../", "./").replace("jquery.js", "");
			} else if (detectedComponentType === "jquery-ui") {
				if (path.indexOf("jquery.js") !== -1) {
					jQueryFolder = path.replace("../../", "./").replace("jquery.js", "");
				} else if (path.indexOf("jquery-ui.js") !== -1) {
					jQueryUIFolder = path.replace("../../", "./").replace("jquery-ui.js", "");
				}
			}
		});

		if (detectedComponentType === "jquery") {
			copydir(jQueryFolder, './dist/jquery/' + componentName + '/framework/jQuery', function() {});
		} else if (detectedComponentType === "jquery-ui") {
			console.log(jQueryFolder);
			console.log(jQueryUIFolder);
			copydir(jQueryFolder, './dist/jquery/' + componentName + '/framework/jQuery', function() {});
			copydir(jQueryUIFolder, './dist/jquery/' + componentName + '/framework/jQueryUI', function() {});
		}

		copydir(__dirname + "/../../" + componentDirectory, './dist/jquery/' + componentName + '/component/', function() {});
	}
};
