const importer = require('../../importer/import')
const expect = require('chai').expect
const assert = require('chai').assert
const AWSMock = require('aws-sdk-mock')
const testUtils = require('../test-utils')
const finnkino = require('finnkino-wrapper')
const sinon = require('sinon')
process.env.MOVIES_TABLE = "MOVIES"

describe('importer', () => {
  describe('import()', () => {
    var finnkinoMovies = []

    finnkino.events = function (options, callback) {
      callback(finnkinoMovies)
    };

    it('should do create two movies', function(done) {
      finnkinoMovies = [
        { ID: 1, Title: "Foo", OriginalTitle: "Foo", EventType: "Movie" },
        { ID: 2, Title: "Bar", OriginalTitle: "Bar", EventType: "Movie" }
      ]

      AWSMock.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
        callback(null, { Items: [] });
      });

      const putSpy = sinon.spy();
      AWSMock.mock('DynamoDB.DocumentClient', 'put', putSpy)

      importer.import({}, {}, function(result) {
        AWSMock.restore("DynamoDB.DocumentClient");
        assert.isTrue(putSpy.calledTwice, 'should have called DynamoDB put twice')
        done();
      });
    });
  })
});
