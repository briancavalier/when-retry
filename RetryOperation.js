var when = require('when');

function ImmediateTrampoline(retryLimit){
	var limit = (!isNaN(retryLimit) ? retryLimit : Infinity);
	var retriesSoFar = 0;
	return function(retryContinuation){
		retriesSoFar += 1;
		if(retriesSoFar <= limit){
			return retryContinuation();
		}
		else{
			throw new Error('Retry limit reached');
		}
	};
}

function RetryStrategy(trampoline, operation){
	return function tryOperation(){
		return when.try(operation).catch(function runFallback(error){
			return trampoline(tryOperation);
		});
	};
}

function ImmediateRetryStrategy(operation, retryLimit){
	var trampoline = ImmediateTrampoline(retryLimit);
	return RetryStrategy(trampoline, operation);
}

module.exports.ImmediateRetryStrategy = ImmediateRetryStrategy;