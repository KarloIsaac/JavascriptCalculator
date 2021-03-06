var OperationsPerformer = function() {
    var firstArgument = null;
    var complementaryArgument = null;
    var operationToApply = null;
    var operationsMap = {};
    const correctionFactor = 10**10;

    initialize();

    function initialize() {
        operationsMap.plus = function() {
            return (firstArgument*correctionFactor + complementaryArgument*correctionFactor) / correctionFactor;
        };
        operationsMap.minus = function() {
            return (firstArgument*correctionFactor - complementaryArgument*correctionFactor) / correctionFactor;
        };
        operationsMap.multiply = function() {
            return (correctionFactor * firstArgument * complementaryArgument) / correctionFactor;
        };
        operationsMap.divide = function() {
            return (firstArgument*correctionFactor) / (complementaryArgument*correctionFactor);
        };
    }

    this.setArguments = function(argument) {
        if (Number.isNaN(argument) || argument == null) {
            return;
        }
        if(this.isReadyToSetSecondArgument()) {
            complementaryArgument = argument;
            return;
        }
        firstArgument = argument;
    };

    this.setOperationToPerform = function(operationSymbol) {
        if(this.isReadyToSetOperation()) {
            operationToApply = operationsMap[operationSymbol];
        }
    };

    this.isReadyToSetOperation = function() {
        return firstArgument !== null;
    }

    this.isReadyToSetSecondArgument = function() {
        return firstArgument !== null && operationToApply !== null;
    }

    this.isReadyToPerformOperation = function() {
        return firstArgument !== null && operationToApply !== null && complementaryArgument !== null;
    }

    this.applyOperation = function() {
        if(operationToApply !== null && complementaryArgument !== null) {
            firstArgument = operationToApply();
        }
        if (firstArgument === Infinity) {
            this.clear();
            return Infinity;
        }
        complementaryArgument = null;
        operationToApply = null;
        return firstArgument;
    };

    this.clear = function() {
        firstArgument = null;
        complementaryArgument = null;
        operationToApply = null;
    }
};


/*
Its purpose is to store the characters which will constitute the figure, such characters are: [0-9]+\.[0-9]*
It only allows the final figure to have a maximum of 10 digits and a decimal point, a total of eleven characters.
It won’t keep storing characters if this causes the creation of an invalid figure pattern.
It is able to render the parsed figure as well as the valid sequence of characters stored.
*/
var FiguresAccummulator = function() {
    var figureText = null;
    const figurePattern = /^[0-9]+\.?[0-9]*$/;
    const onlyDigitsPattern = /^[0-9]{10}$/;
    const lazyZeroesPattern = /^0+(?=(0.|\d))/;

    this.captureFigureInformation = function(figureInfo) {
        if(isDigitsNumberLimitMet()) {
            return;
        }
        var potentialNewFigureCharactersStore = figureText === null ? figureInfo : figureText + figureInfo;
        potentialNewFigureCharactersStore = potentialNewFigureCharactersStore === "."
                ? "0."
                : potentialNewFigureCharactersStore;
        potentialNewFigureCharactersStore = removeLazyZeroes(potentialNewFigureCharactersStore);
        if(figurePattern.test(potentialNewFigureCharactersStore)) {
            figureText = potentialNewFigureCharactersStore;
        }
    }

    function isDigitsNumberLimitMet() {
        if(figureText !== null && (onlyDigitsPattern.test(figureText) || figureText.length >= 11)) {
            return true;
        }
        return false;
    }

    function removeLazyZeroes(digitsStorage) {
        var lazyZeroesFreeString = digitsStorage.replace(lazyZeroesPattern, "");
        return lazyZeroesFreeString;
    }

    this.retrieveFigure = function() {
        var floatValue = figureText === null || figureText === ""
                ? null
                : Number.parseFloat(figureText);
        return floatValue;
    }

    this.retrieveFigureCharacters = function() {
        var storedCharacters = figureText === null ? "0" : figureText;
        return storedCharacters;
    }

    this.clear = function() {
        figureText = null;
    }

    this.isEmpty = function() {
        return figureText === null;
    }
}


/***
This logic unit purpose is to receive numeric information and, if necessary, transform it into scientific notation.
It is able to say if the data required scientific notation parsing.
***/
var ScientificNotationParser = function() {
    var numericInformation = 0;
    var scientificNotationExponential = 0;

    this.parseFigure = function(figure) {
        clear();
        if(!isNumber(figure) || figure === 0) {
            return;
        }
        if(shouldUseScientificNotation(figure)) {
            scientificNotationExponential = calculateScientificNotationExponential(figure);
            figure = figure / Math.pow(10, scientificNotationExponential);
        }
        numericInformation = figure;
    }

    function clear() {
        numericInformation = 0;
        scientificNotationExponential = 0;
    }

    function isNumber(assessingValue) {
        return isFinite(assessingValue) && assessingValue === +assessingValue;
    }

    function calculateScientificNotationExponential(referenceFigure) {
        referenceFigure = Math.abs(referenceFigure);
        var exponential = Math.log10(referenceFigure);
        exponential = Math.floor(exponential);
        return exponential;
    }

    function shouldUseScientificNotation(referenceFigure) {
        referenceFigure = Math.abs(referenceFigure);
        return referenceFigure > 9999999999 || referenceFigure < 0.00000001;
    }

    this.isScientificNotation = function() {
        return scientificNotationExponential !== 0;
    }

    this.retrieveNumericPortion = function() {
        return numericInformation;
    }

    this.retrieveScientificNotationExponential = function() {
        return scientificNotationExponential;
    }
}


MainDisplayUpdater = function() {
	var charImageMap = {"E":buildCharImage("E"), "r":buildCharImage("r"), ".":buildCharImage("dot"),
            "0":buildCharImage("0"), "1":buildCharImage("1"), "2":buildCharImage("2"), "3":buildCharImage("3"),
            "4":buildCharImage("4"), "5":buildCharImage("5"), "6":buildCharImage("6"), "7":buildCharImage("7"),
            "8":buildCharImage("8"), "9":buildCharImage("9"), "-":buildCharImage("-"),
			"¬":buildCharImage("0clear")};

    function buildCharImage(imageName) {
        var fileName = imageName === "." ? "dot" : imageName;
        var imageRoute = "https://raw.githubusercontent.com/KarloIsaac/JavascriptCalculator/" +
                "master/number_Images/big/" + fileName + ".png";
        var imageElement = document.createElement("img");
        imageElement.src = imageRoute;
        imageElement.alt = imageName;
        return imageElement;
    }

	this.updateDisplay = function(numberText) {
		numberText = prependEmptyImageSymbol(numberText);
        var mainDisplay = document.getElementById("main-display");
        mainDisplay.innerHTML = "";
        numberText.split("").forEach(char => {
            var imageChar = charImageMap[char].cloneNode();
            mainDisplay.appendChild(imageChar);
        });
    }

	function prependEmptyImageSymbol(referenceText) {
		var slotsToFill = 12 - referenceText.length;
		var emptySymbolString = "¬".repeat(slotsToFill);
		return emptySymbolString + referenceText;
	}
}


ScientificDisplayUpdater = function() {
	var charImageMap = {"0":buildCharImage("0"), "1":buildCharImage("1"), "2":buildCharImage("2"),
			"3":buildCharImage("3"), "4":buildCharImage("4"), "5":buildCharImage("5"), "6":buildCharImage("6"),
			"7":buildCharImage("7"), "8":buildCharImage("8"), "9":buildCharImage("9"), "-":buildCharImage("-"),
			"¬":buildCharImage("0clear")};

    function buildCharImage(imageName) {
        var imageRoute = "https://raw.githubusercontent.com/KarloIsaac/JavascriptCalculator/" +
                "master/number_Images/smaller/" + imageName + ".png";
        var imageElement = document.createElement("img");
        imageElement.src = imageRoute;
        imageElement.alt = imageName;
        return imageElement;
    }

	this.updateDisplay = function(number) {
		if(number === 0) {
			displayPowerText("¬¬¬");
			setBaseColor(false);
		} else {
			displayPowerText(String(number));
			setBaseColor(true);
		}
    }

	function displayPowerText(text) {
		text = appendEmptyImageSymbol(text);
		var display = document.getElementById("scientific-power");
		display.innerHTML = "";
		text.split("").forEach(char => {
            var imageChar = charImageMap[char].cloneNode();
            display.appendChild(imageChar);
        });
	}

	function appendEmptyImageSymbol(referenceText) {
		var slotsToFill = 4 - referenceText.length;
		var emptySymbolString = "¬".repeat(slotsToFill);
		return referenceText + emptySymbolString;
	}

	function setBaseColor(isEnabled) {
		var color = isEnabled ? "black" : "rgb(160, 181, 186)";
		var baseDisplay = document.getElementById("scientific-notation-display");
		baseDisplay.style.color = color;
	}
}

/*
Its purpose is to receive the information that requires to be updated on the main display.
The display has only the capability to display 11 characters: 10 numbers an one decimal point.
The information may be adjusted to be appropriately displayed, for instance the number may need a scientific notation
parsing.
*/
var ScreenUpdater = function () {
    var scientificNotationParser = new ScientificNotationParser();
	var mainDisplayUpdater = new MainDisplayUpdater();
	var scientificDisplayUpdater = new ScientificDisplayUpdater();

    this.clear = function() {
        this.updateDisplay("0.");
    }

    this.updateDisplay = function(screenInformation) {
        var numericPortion = "";
        var scientificNotationExponential = 0;
        if(screenInformation === Infinity) {
            numericPortion = "Err.";
        } else if(typeof screenInformation === "string") {
            numericPortion = adjustDecimalPointPresentation(screenInformation);
        } else {
            scientificNotationParser.parseFigure(screenInformation);
            numericPortion = adjustNumberPresentation(scientificNotationParser.retrieveNumericPortion());
            scientificNotationExponential = scientificNotationParser.retrieveScientificNotationExponential();
        }
        mainDisplayUpdater.updateDisplay(numericPortion);
        scientificDisplayUpdater.updateDisplay(scientificNotationExponential);
    }

    function adjustNumberPresentation(referenceNumericValue) {
        referenceNumericValue = truncateToTenDigits(referenceNumericValue);
        return adjustDecimalPointPresentation(referenceNumericValue);
    }

    function truncateToTenDigits(figure) {
    	var signAdjustment = figure < 0 ? -1 : 1;
    	figure = Math.abs(figure);
    	var roundPositions = 9 - (figure < 1 ? 0 : Math.floor(Math.log10(figure)));
    	var roundingFactor = 10**roundPositions;
    	var truncatedFigure = Math.round((figure + Number.EPSILON) * roundingFactor ) / roundingFactor;
    	return truncatedFigure * signAdjustment;
    }

    function adjustDecimalPointPresentation(referenceNumericValue) {
        var adjustedNumericPresentation = String(referenceNumericValue);
        adjustedNumericPresentation = adjustedNumericPresentation.includes(".")
                ? adjustedNumericPresentation
                : adjustedNumericPresentation + ".";
        return adjustedNumericPresentation;
    }

    function displayScientificPower(powerNumber) {
        document.getElementById("scientific-power").innerText = powerNumber;
    }
}


var OperationsRequestsController = function() {
    var operationsPerformer = new OperationsPerformer();
    var figuresAccummulator = new FiguresAccummulator();
    var screenUpdater = new ScreenUpdater();

    this.processFigureSettingRequest = function(sourceElement) {
        var figureText = sourceElement.innerText;
        figuresAccummulator.captureFigureInformation(figureText);
        screenUpdater.updateDisplay(figuresAccummulator.retrieveFigureCharacters());
    }

    this.processOperationRequest = function(sourceElement) {
        if(operationsPerformer.isReadyToSetSecondArgument()) {
            peformOperation();
        } else {
            var numericArgument = figuresAccummulator.retrieveFigure();
            operationsPerformer.setArguments(numericArgument);
        }
        if(operationsPerformer.isReadyToSetOperation()) {
            var operationName = sourceElement.id;
            operationsPerformer.setOperationToPerform(operationName);
            figuresAccummulator.clear();
        }
    }

    function concatenateOperation() {
        var numericArgument = figuresAccummulator.retrieveFigure();
        operationsPerformer.setArguments(numericArgument);
    }

    this.processRetrieveResultRequest = function() {
        peformOperation();
    }

    function peformOperation() {
        var complementaryArgument = figuresAccummulator.retrieveFigure();
        operationsPerformer.setArguments(complementaryArgument);
        if(operationsPerformer.isReadyToPerformOperation()) {
            var operationResult = operationsPerformer.applyOperation();
            screenUpdater.updateDisplay(operationResult);
            figuresAccummulator.clear();
        }
    }

    this.clearAll = function() {
        clearData();
        screenUpdater.clear();
    }

    function clearData() {
        operationsPerformer.clear();
        figuresAccummulator.clear();
    }
}


var operationsRequestsController = new OperationsRequestsController();
