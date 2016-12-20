//import all modules that used for transformation
let componentPreparation = require("./ComponentPreparation/componentPreparation.js");
let componentClassification = require("./ComponentClassification/componentClassification.js");
let fileWriter = require("./FileWriter/fileSystemWorker.js");
let visualDesign = require("./VisualDesign/extractVisuals.js")
let informationExtraction = require("./FunctionPreservation/informationExtraction.js");

//let hoist = require('hoister');

//get the arguments that are passed from the command line
let argv = require('minimist')(process.argv.slice(2));
let componentPath = argv.path;
let componentName = argv.name;
let componentMainFilePath = argv.main;

//start the transformation with the determination of the component type
//console.log("Determinate the Component Type...");
componentPreparation.getComponentsFilePaths(componentPath, function(filePaths) {

	fileWriter.createComponentFolder(componentName, function() {
		//console.log(componentMainFilePath);
		let foundFile = componentPreparation.findJavaScriptFile(filePaths, componentMainFilePath);

			componentPreparation.parseJavaScriptFile(foundFile[0], function(analysisResult) {
				componentClassification.analyzeComponentType(filePaths, analysisResult, function(detectedComponentType) {
					fileWriter.debugWriteFile(componentName, analysisResult);

					let javaScriptFilePath = componentPreparation.processFilePath(foundFile[0], componentName);
					componentPreparation.getFrameworkPaths(detectedComponentType, componentName, function(frameworkPaths) {
						componentPreparation.getFrameworkStylePaths(detectedComponentType, componentName, function(frameworkStylePath) {
							let extractedFunctions = informationExtraction.getFunctions(analysisResult);
							let foundProperties = informationExtraction.getProperties(analysisResult, detectedComponentType);
							let detectedCreationFunction = informationExtraction.getCreationFunction(analysisResult, detectedComponentType);

							let visualFile = visualDesign.extractVisualRules(componentName, filePaths, detectedComponentType);
							let templateObject = visualDesign.extractTemplate(analysisResult, detectedComponentType, componentName);

							informationExtraction.getChangeTrigger(analysisResult, foundProperties, function(changeTrigger) {
								let attributeChangedFunction = informationExtraction.generateAttributeChangedFunction(foundProperties, extractedFunctions, detectedCreationFunction, detectedComponentType);
								let generatedCreationFunction = informationExtraction.generateCreationFunction(foundProperties, extractedFunctions, detectedCreationFunction, detectedComponentType, templateObject, changeTrigger);

								componentPreparation.getPolymerFilePath(componentName, function(polymerPath) {
									fileWriter.copyFolders(polymerPath, frameworkPaths, componentPath, componentName, detectedComponentType);

									fileWriter.writeComponentFile(
										componentName,
										detectedComponentType,
										informationExtraction.postProcessProperties(foundProperties),
										attributeChangedFunction,
										generatedCreationFunction,
										visualFile,
										templateObject,
										componentMainFilePath,
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
