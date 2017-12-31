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
        storedCharacters = storedCharacters.includes(".") ? storedCharacters : storedCharacters + ".";
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
    var numericInformation = "0.";
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
        figure = String(figure);
        numericInformation = figure.includes(".") ? figure : figure + ".";
    }

    function clear() {
        numericInformation = "0.";
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


/*
Its purpose is to receive the information that requires to be updated on the main display.
This information should have two possible natures: numeric information and text information with the capability of becoming numeric data.
This logic unit is not in charge of assessing the latter case.
In the case of numeric data, adjustments must be done to ensure that the information is appropriately displayed.
This logic unit makes no adjustment but coordinates them.
*/
var ScreenUpdater = function () {
    var scientificNotationParser = new ScientificNotationParser();

    this.clear = function() {
        this.updateMainDisplay("0.");
    }

    this.updateMainDisplay = function(screenInformation) {
        var numericPortion = "";
        var scientificNotationExponential = 0;
        scientificNotationParser.parseFigure(screenInformation);
        if(scientificNotationParser.isScientificNotation()) {
            numericPortion = scientificNotationParser.retrieveNumericPortion();
            var scientificNotationExponential = scientificNotationParser.retrieveScientificNotationExponential();
        } else {
            numericPortion = screenInformation;
        }
        getMainDisplay().innerText = numericPortion;
        document.getElementById("scientific-power").innerText = scientificNotationExponential;
    }

    function getMainDisplay() {
        return document.getElementById("main-display");
    }
}


var OperationsRequestsController = function() {
    var operationsPerformer = new OperationsPerformer();
    var figuresAccummulator = new FiguresAccummulator();
    var screenUpdater = new ScreenUpdater();

    this.processFigureSettingRequest = function(sourceElement) {
        var figureText = sourceElement.innerText;
        figuresAccummulator.captureFigureInformation(figureText);
        screenUpdater.updateMainDisplay(figuresAccummulator.retrieveFigureCharacters());
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
            screenUpdater.updateMainDisplay(operationResult);
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
