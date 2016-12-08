//import all modules that used for transformation
let componentPreparation = require("./ComponentPreparation/componentPreparation.js");
let componentClassification = require("./ComponentClassification/componentClassification.js");
let fileWriter = require("./FileWriter/writeFile.js");
let visualDesign = require("./VisualDesign/extractVisuals.js")
let informationExtraction = require("./FunctionPreservation/informationExtraction.js");

let hoist = require('hoister');

let esprima = require('esprima');

//get the arguments that are passed from the command line
let argv = require('minimist')(process.argv.slice(2));
let componentPath = argv.path;
let componentName = argv.name;
let componentMainFile = argv.main;


//componentPreparation.parseJavaScriptFile("/home/florian/Schreibtisch/Masterarbeit/react-es6-webpack-boilerplate-master/components/select2-master/dist/js/select2.full.js", function(data) {
//	console.log(data);
//})

//start the transformation with the determination of the component type
//console.log("Determinate the Component Type...");
componentPreparation.getComponentsFilePaths(componentPath, function(filePaths) {

	let foundFile = componentPreparation.findJavaScriptFile(filePaths, componentMainFile);
	let enhancedAnalysisResult;

	//this transformation implementation can only find one component file and transform it
	componentPreparation.parseJavaScriptFile(foundFile[0], function(analysisResult) {
		fileWriter.debugWriteFile(componentName, analysisResult);
		let detectedComponentType = componentClassification.analyzeComponentType(filePaths, analysisResult, function(detectedComponentType) {
			enhancedAnalysisResult = hoist(analysisResult);
			let extractedFunctions = informationExtraction.getFunctions(enhancedAnalysisResult);
			let foundProperties = ""; //informationExtraction.getProperties(enhancedAnalysisResult, detectedComponentType);
			let creationFunction = informationExtraction.getCreationFunction(enhancedAnalysisResult, detectedComponentType);

			console.log(creationFunction);

			let synchronizeFunction = ""; //informationExtraction.generateSynchronizeFunction(foundProperties, extractedFunctions);

			let visualFile = visualDesign.extractVisuals(componentName, filePaths);
			let template = visualDesign.extractTemplate(enhancedAnalysisResult, detectedComponentType, componentName);

			fileWriter.writeComponentFile(componentName, detectedComponentType, foundProperties, synchronizeFunction, visualFile, template, creationFunction);
		});
	});
});
