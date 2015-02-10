var ImmediateRetryStrategy = require('./RetryOperation').ImmediateRetryStrategy;
var assert = require('assert');

describe('ImmediateRetryStrategy', function(){
	it('should retry the provided operation until successful', function(){
		var processedIterations = 0;
		var requiredIterations = 200;
		var retry = ImmediateRetryStrategy(function flakyOperation(){
			if(processedIterations < requiredIterations){
				processedIterations += 1;
				throw new Error('Try again!');
			}
			return 'success';
		});
		return retry().then(function(operationResult){
			assert.equal(operationResult, 'success');
		});
	});
});