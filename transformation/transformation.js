//import all modules that used for transformation
let componentPreparation = require("./ComponentPreparation/componentPreparation.js");
let componentClassification = require("./ComponentClassification/componentClassification.js");
let fileWriter = require("./FileWriter/writeFile.js");
let visualDesign = require("./VisualDesign/extractVisuals.js")
let informationExtraction = require("./FunctionPreservation/informationExtraction.js");

let hoist = require('hoister');

//get the arguments that are passed from the command line
let argv = require('minimist')(process.argv.slice(2));
let componentPath = argv.path;
let componentName = argv.name;

//start the transformation with the determination of the component type
//console.log("Determinate the Component Type...");
componentPreparation.getComponentsFilePaths(componentPath, function(filePaths) {

	let foundFiles = componentPreparation.findJavaScriptFiles(filePaths);
	console.log(foundFiles);


	let parsed = componentPreparation.parseJavaScriptFile(
		//"/home/florian/Schreibtisch/Masterarbeit/react-es6-webpack-boilerplate-master/components/react-file-input/react-file-input/lib/index.js",
		"/home/florian/Schreibtisch/Masterarbeit/react-es6-webpack-boilerplate-master/components/jquery-colorpicker/evol-colorpicker/js/evol-colorpicker.js",
		function(analysisResult) {
			let enhancedAnalysisResult = hoist(analysisResult);
			let detectedComponentType = componentClassification.analyzeComponentType(filePaths, enhancedAnalysisResult, function(detectedComponentType) {
				//console.log("Component Type is determined!");

				let extractedFunctions = informationExtraction.getFunctions(enhancedAnalysisResult);
				let foundProperties = informationExtraction.getProperties(enhancedAnalysisResult, detectedComponentType);

				let synchronizeFunction = informationExtraction.generateSynchronizeFunction(foundProperties, extractedFunctions);

				//fileWriter.debugWriteFile(componentName, enhancedAnalysisResult);

				let visualFile = visualDesign.extractVisuals(componentName, filePaths);
				let template = visualDesign.extractTemplate(enhancedAnalysisResult, detectedComponentType);

				fileWriter.writeComponentFile(componentName, filePaths);
			});
	});
});
