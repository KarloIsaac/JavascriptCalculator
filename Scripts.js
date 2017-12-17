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
        if(firstArgument !== null) {
            operationToApply = operationsMap[operationSymbol];
        }
    };

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

    this.captureFigureInformation = function(sourceElement) {
        figureText += sourceElement.innerText;
    }

    this.flushFigure = function() {
        var floatValue = Number.parseFloat(figureText);
        figureText = "";
        return floatValue;
    }
}


var figuresAccummulator = new FiguresAccummulator();


var OperationsRequestsController = function() {
    var operationsPerformer = new OperationsPerformer();

    this.processOperationRequest = function(sourceElement) {
        var firstArgument = figuresAccummulator.flushFigure();
        operationsPerformer.setArguments(firstArgument);
        var operationName = sourceElement.id;
        operationsPerformer.setOperationToPerform(operationName);
    }

    this.processRetrieveResultRequest = function() {
        var complementaryArgument = figuresAccummulator.flushFigure();
        operationsPerformer.setArguments(complementaryArgument);
        var operationResult = operationsPerformer.retrieveResult();
        console.log(operationResult);
    }
}


var operationsRequestsController = new OperationsRequestsController();
