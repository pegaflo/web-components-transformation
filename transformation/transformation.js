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

	fileWriter.createComponentFolder(componentName, function() {
		let foundFile = componentPreparation.findJavaScriptFile(filePaths, componentMainFile);
		let enhancedAnalysisResult;

		componentPreparation.getPolymerFilePath(componentName, function(polymerPath) {
			console.log(polymerPath);
			componentPreparation.parseJavaScriptFile(foundFile[0], function(analysisResult) {
				componentClassification.analyzeComponentType(filePaths, analysisResult, function(detectedComponentType) {
					fileWriter.debugWriteFile(componentName, analysisResult);

					let javaScriptFilePath = componentPreparation.processJavaScriptFile(foundFile[0]);
					componentPreparation.getFrameworkPaths(detectedComponentType, componentName, function(frameworkPaths) {
						componentPreparation.getFrameworkStylePaths(detectedComponentType, componentName, function(frameworkStylePath) {
							enhancedAnalysisResult = hoist(analysisResult);

							let extractedFunctions = informationExtraction.getFunctions(enhancedAnalysisResult);
							let foundProperties = informationExtraction.getProperties(enhancedAnalysisResult, detectedComponentType);
							let detectedCreationFunction = informationExtraction.getCreationFunction(enhancedAnalysisResult, detectedComponentType);

							let visualFile = visualDesign.extractVisuals(componentName, filePaths, detectedComponentType);
							let templateObject = visualDesign.extractTemplate(enhancedAnalysisResult, detectedComponentType, componentName);

							informationExtraction.getChangeTrigger(enhancedAnalysisResult, foundProperties, function(changeTrigger) {
								let attributeChangedFunction = informationExtraction.generateAttributeChangedFunction(foundProperties, extractedFunctions, detectedCreationFunction, detectedComponentType);
								let generatedCreationFunction = informationExtraction.generateCreationFunction(foundProperties, extractedFunctions, detectedCreationFunction, detectedComponentType, templateObject, changeTrigger);

								fileWriter.writeComponentFile(
									componentName,
									detectedComponentType,
									informationExtraction.postProcessProperties(foundProperties),
									attributeChangedFunction,
									generatedCreationFunction,
									visualFile,
									templateObject,
									javaScriptFilePath,
									polymerPath,
									frameworkPaths,
									frameworkStylePath
								);
							});
						});
					});
				});
			});
		});
	});
});
