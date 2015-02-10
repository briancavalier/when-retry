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
	it('should fail after too many retries', function(){
		var retry = ImmediateRetryStrategy(function(){
			throw new Error('Not feeling like working...');
		}, 42);
		return retry().catch(function(error){
			assert.equal(error.message, 'Retry limit reached');
		});
	});
});