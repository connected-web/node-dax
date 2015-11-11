var expect = require('chai').expect;
var logger = require('../../lib/util/logger');

describe('Logger', function() {

    it('should have a default target of the console', function() {
        expect(logger.target).to.equal(console);
    });

    it('should be disabled by default', function() {
        expect(logger.enabled).to.equal(false);
    });

    describe('When enabled', function() {

        beforeEach(function() {
            logger.enabled = true;
        });

        it('should log to the target', function(done) {
            var expected = 'Some log message';
            logger.target = expectedTarget('log', expected, done);
            logger.log(expected);
        });

        it('should info to the target', function(done) {
            var expected = 'Some info message';
            logger.target = expectedTarget('info', expected, done);
            logger.info(expected);
        });

        it('should error to the target', function(done) {
            var expected = 'Some error message';
            logger.target = expectedTarget('error', expected, done);
            logger.error(expected);
        });
    });

    describe('When disabled', function() {

        beforeEach(function() {
            logger.enabled = false;
        });

        it('should not log to the target', function() {
            var expected = 'Some log message';
            logger.target = notExpectedTarget('log', expected);
            logger.log(expected);
        });

        it('should not info to the target', function() {
            var expected = 'Some info message';
            logger.target = notExpectedTarget('info', expected);
            logger.info(expected);
        });

        it('should not error to the target', function() {
            var expected = 'Some error message';
            logger.target = notExpectedTarget('error', expected);
            logger.error(expected);
        });
    });
});

function expectedTarget(property, expected, done) {
    var target = {};
    target[property] = function(message) {
        expect(message).to.equal(expected);
        done();
    };
    return target;
}

function notExpectedTarget(property, expected) {
    var target = {};
    target[property] = function(message) {
        throw `Did not expect ${property} to be called on ${target}`;
    };
    return target;
}