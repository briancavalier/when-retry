var when = require('when');

function ImmediateTrampoline(){
	return function(retryContinuation){
		return retryContinuation();
	};
}

function RetryStrategy(trampoline, operation){
	return function tryOperation(){
		return when.try(operation).catch(function runFallback(error){
			return trampoline(tryOperation);
		});
	};
}

function ImmediateRetryStrategy(operation){
	var trampoline = ImmediateTrampoline();
	return RetryStrategy(trampoline, operation);
}

module.exports.ImmediateRetryStrategy = ImmediateRetryStrategy;