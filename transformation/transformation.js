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
let componentMainFile = argv.main;

//start the transformation with the determination of the component type
//console.log("Determinate the Component Type...");
componentPreparation.getComponentsFilePaths(componentPath, function(filePaths) {

	let foundFile = componentPreparation.findJavaScriptFile(filePaths, componentMainFile);
	let enhancedAnalysisResult;

	componentPreparation.getPolymerFilePath(function(polymerPath) {
		//this transformation implementation can only find one component file and transform it
		componentPreparation.parseJavaScriptFile(foundFile[0], function(analysisResult) {
			let detectedComponentType = componentClassification.analyzeComponentType(filePaths, analysisResult, function(detectedComponentType) {
				enhancedAnalysisResult = hoist(analysisResult);

				let extractedFunctions = informationExtraction.getFunctions(enhancedAnalysisResult);
				let foundProperties = informationExtraction.getProperties(enhancedAnalysisResult, detectedComponentType);
				let detectedCreationFunction = informationExtraction.getCreationFunction(enhancedAnalysisResult, detectedComponentType);

				let visualFile = visualDesign.extractVisuals(componentName, filePaths);
				let templateObject = visualDesign.extractTemplate(enhancedAnalysisResult, detectedComponentType, componentName);

				let attributeChangedFunction = informationExtraction.generateAttributeChangedFunction(foundProperties, extractedFunctions, detectedCreationFunction, detectedComponentType);
				let generatedCreationFunction = informationExtraction.generateCreationFunction(foundProperties, extractedFunctions, detectedCreationFunction, detectedComponentType, templateObject);


				fileWriter.debugWriteFile(componentName, templateObject);

				//trigger function of the writing of the component fileWriter
				// transform extracted information in a structure, so it can be copied without further transformation
				fileWriter.writeComponentFile(
					componentName,
					detectedComponentType,
					informationExtraction.postProcessProperties(foundProperties),
					attributeChangedFunction,
					generatedCreationFunction,
					visualFile,
					templateObject,
					foundFile[0],
					polymerPath
				);
			});
		});
	});
});
