var OperationsPerformer = function() {
    var firstArgument = null;
    var complementaryArgument = null;
    var operationToApply = null;
    var operationsMap = {};

    initialize();

    function initialize() {
        operationsMap.plus = function() {
            return (firstArgument*10**9 + complementaryArgument*10**9) / 10**9;
        };
        operationsMap.minus = function() {
            return (firstArgument*10**9 - complementaryArgument*10**9) / 10**9;
        };
        operationsMap.multiply = function() {
            return ((firstArgument*10**9) * (complementaryArgument*10**9)) / 10**18;
        };
        operationsMap.divide = function() {
            return (firstArgument*10**9) / (complementaryArgument*10**9);
        };
    }

    this.setArguments = function(argument) {
        if (Number.isNaN(argument)) {
            return;
        }
        complementaryArgument = firstArgument === null ? null : argument;
        firstArgument = firstArgument === null ? argument : firstArgument;
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


var FiguresAccummulator = function() {
    var figureText = null;

    this.captureFigureInformation = function(figureInfo) {
        if(isDigitsNumberLimitMet()) {
            return;
        }
        if(figureInfo === "." && doesFigureTextAlrreadyHaveADecimalPoint()) {
            figureInfo = "";
        }
        figureText = figureText === null ? figureInfo : figureText + figureInfo;
    }

    function isDigitsNumberLimitMet() {
        return figureText !== null && figureText.length >= 10;
    }

    function doesFigureTextAlrreadyHaveADecimalPoint() {
        figureText !== null && figureText.includes(".");
    }

    this.retrieveFigure = function() {
        var figureRepresentation = figureText === "." ? "0" : figureText;
        var floatValue = figureRepresentation === null || figureRepresentation === ""
                ? null
                : Number.parseFloat(figureRepresentation);
        return floatValue;
    }

    this.clear = function() {
        figureText = null;
    }

    this.isEmpty = function() {
        return figureText === null;
    }
}


var FiguresToStringParser = function() {
    var numericInformation = "0.";
    var scientificNotationExponential = 0;

    this.parseFigure = function(figure) {
        clear();
        if(figure === null) {
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

    function calculateScientificNotationExponential(referenceFigure) {
        referenceFigure = Math.abs(referenceFigure);
        var exponential = Math.log10(referenceFigure);
        exponential = Math.floor(exponential);
        return exponential;
    }

    function shouldUseScientificNotation(referenceFigure) {
        referenceFigure = Math.abs(referenceFigure);
        return referenceFigure > 99999999999 || referenceFigure < 0.000000001;
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


var ScreenUpdater = function () {
    var figuresToStringParser = new FiguresToStringParser();

    this.clear = function() {
        this.updateMainDisplay(null);
    }

    this.updateMainDisplay = function(screenInformation) {
        figuresToStringParser.parseFigure(screenInformation);
        var numericPortion = figuresToStringParser.retrieveNumericPortion();
        getMainDisplay().innerText = numericPortion;
        var scientificNotationExponential = figuresToStringParser.retrieveScientificNotationExponential();
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
        screenUpdater.updateMainDisplay(figuresAccummulator.retrieveFigure());
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
