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
        firstArgument = firstArgument === null ? argument : null;
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


var operationsPerformer = new OperationsPerformer();
