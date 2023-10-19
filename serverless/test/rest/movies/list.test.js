const movies_list = require('../../../rest/movies/list')
const auth = require('../../../utils/auth')
const expect = require('chai').expect;
const AWSMock = require('aws-sdk-mock');
const testUtils = require('../../test-utils')
process.env.MOVIES_TABLE = "MOVIES"

describe('movies', () => {
  describe('list()', () => {
    const displayableMovies = [
      { id: 1, title: "Psycho" }
    ]

    const allMovies = displayableMovies.concat([
      { id: 2, title: "Vertigo" }
    ])

    it('should return displayable movies when a normal user makes the request', async () => {
      AWSMock.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
          callback(null, { Items: displayableMovies });
        }
      );
      const response = await movies_list.list({})
      const body = JSON.parse(response.body)
      expect(response.statusCode).to.equal(200)
      expect(body.Items).to.be.an('array').with.lengthOf(1)
      expect(body.Items).to.deep.include({ id: 1, title: "Psycho" })
      AWSMock.restore("DynamoDB.DocumentClient");
    });

    it('should return all movies when an admin user makes the request', async () => {
      AWSMock.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
          callback(null, { Items: allMovies });
        }
      );
      // Only admins can get the full list of movies.
      // Create an event object containing admin JWT token.
      var event = testUtils.initializeAdminRequestEvent()
      // Set ?all=true parameter to the request in order to get all the movies.
      event.queryStringParameters = { all: 'true' }

      const response = await movies_list.list(event)
      const body = JSON.parse(response.body)
      expect(response.statusCode).to.equal(200)
      expect(body.Items).to.be.an('array').with.lengthOf(2)
      AWSMock.restore("DynamoDB.DocumentClient");
    });

    it('should respond with an error code if non-admin user tries to get all movies', async () => {
      // Set ?all=true parameter to the request in order to try to get all the movies.
      const event = { headers: [], queryStringParameters: { all: 'true' } }
      const response = await movies_list.list(event)
      expect(response.statusCode).to.equal(403)
    });
  })
});
