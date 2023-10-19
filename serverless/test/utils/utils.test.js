const utils = require('../../utils')
var expect = require('chai').expect;

describe('utils', () => {
  describe('#getQueryParam()', () => {
    it('should find request param', () => {
      var params = {something: 'value'}
      var mockEvent = {queryStringParameters: params}
      var res = utils.getQueryParam('something', mockEvent)
      expect(res).to.equal('value')
    })

    it('should NOT find request param', () => {
      var mockEvent = {}
      var res = utils.getQueryParam('something', mockEvent)
      expect(res).to.be.null

      mockEvent = {queryStringParameters: {}}
      res = utils.getQueryParam('something', mockEvent)
      expect(res).to.be.null
    })
  })

  describe('date utils', () => {
    beforeEach(function () {
      originalDateNow = Date.now;
      Date.now = mockDateNow;
    });

    afterEach(function () {
      Date.now = originalDateNow;
    });
    
    describe('#getDateDaysAgoInIsoFormat()', () => {
      it('should return correct date', () => {
        var isoDate = utils.getDateDaysAgoInIsoFormat(1)
        expect(isoDate).to.equal("2019-01-19T00:00:00.000Z")
      })
    })
  })
})

function mockDateNow() {
   // mock now = 1462361249717ms = 4th May 2016
   return 1547942400000;
}
