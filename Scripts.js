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

    this.setArguments= function(argument) {
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

    this.retrieveResult = function() {
        var result = this.applyOperation();
        this.clear();
        return result;
    }

    this.applyOperation = function() {
        if(operationToApply !== null && complementaryArgument !== null) {
            firstArgument = operationToApply();
        }
        return firstArgument;
    };

    this.clear = function() {
        firstArgument = null;
        complementaryArgument = null;
        operationToApply = null;
    };
};


var FiguresAccummulator = function() {
    var figureText = "";

    this.captureFigureInformation = function(figureInfo) {
        figureText += figureInfo;
    }

    this.retrieveFigure = function() {
        var floatValue = Number.parseFloat(figureText);
        return floatValue;
    }

    this.clear = function() {
        figureText = "";
    }

    this.isEmpty = function() {
        return figureText === "";
    }
}


var ScreenUpdater = function () {

    this.updateMainDisplay = function(screenInformation) {
        getMainDisplay().innerText = screenInformation;
    }

    this.clear = function() {
        getMainDisplay().innerText = "0";
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
        var firstArgument = figuresAccummulator.retrieveFigure();
        if (!Number.isNaN(firstArgument)) {
            operationsPerformer.setArguments(firstArgument);
            var operationName = sourceElement.id;
            operationsPerformer.setOperationToPerform(operationName);
        } else {
            clearAll();
        }
        figuresAccummulator.clear();
    }

    this.processRetrieveResultRequest = function() {
        var complementaryArgument = figuresAccummulator.retrieveFigure();
        operationsPerformer.setArguments(complementaryArgument);
        var operationResult = operationsPerformer.retrieveResult();
        clearData();
        screenUpdater.updateMainDisplay(operationResult);
    }

    function clearAll() {
        clearData();
        screenUpdater.clear();
    }

    function clearData() {
        operationsPerformer.clear();
        figuresAccummulator.clear();
    }
}





var operationsRequestsController = new OperationsRequestsController();
