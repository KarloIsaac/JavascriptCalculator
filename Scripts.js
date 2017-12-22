var OperationsPerformer = function() {
    var firstArgument = null;
    var complementaryArgument = null;
    var operationToApply = null;
    var operationsMap = {};

    initialize();

    function initialize() {
        operationsMap.plus = function() {
            return firstArgument + complementaryArgument;
        };
        operationsMap.minus = function() {
            return firstArgument - complementaryArgument;
        };
        operationsMap.multiply = function() {
            return firstArgument * complementaryArgument;
        };
        operationsMap.divide = function() {
            return firstArgument / complementaryArgument;
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

    this.parseFigure = function(figureInformation) {
        if(figureInformation === null) {
            clear();
            return;
        }
        figureInformation = String(figureInformation);
        numericInformation = figureInformation.includes(".") ? figureInformation : figureInformation + ".";
    }

    function clear() {
        numericInformation = "0.";
    }

    this.retrieveNumericPortion = function() {
        return numericInformation;
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
