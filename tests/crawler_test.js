/* global it, describe, before, beforeEach */

const chai = require('chai');
const Promise = require('bluebird');

// const should = chai.should();
const expect = chai.expect;

const {
  getBody,
  getDomain,
  getUrls,
  getVisitedUrlsSize,
  getToBeVisitedUrlsSize,
  getRDFTripletObject,
  hasToBeVisitedUrl,
  hasVisitedUrl,
  setDomain,
  hasResourceInPath,
} = require('../app/utils/Crawler');

const url = 'http://dbpedia.org/page/Nanyue_Huisi';

describe('Crawler', () => {
  describe('getUrls function', () => {
    let urls;

    before(() => Promise.resolve(getBody(url))
        .then(getUrls)
        .then((data) => {
          urls = data;
          return null;
        })
    );

    it('it should return array', (done) => {
      expect(urls).to.be.an('array');
      done();
    });

    it('shave have visited urls length equal 1', (done) => {
      expect(getVisitedUrlsSize()).to.equal(1);
      done();
    });

    it('should have visitedUrl of url, and not have to be visited url of url', (done) => {
      expect(hasVisitedUrl(url)).to.equal(true);
      expect(hasToBeVisitedUrl(url)).to.equal(false);
      done();
    });

    it('should add many urls to be visited', (done) => {
      expect(getToBeVisitedUrlsSize()).to.be.above(1);
      done();
    });

    it('should not visit already visited url', (done) => {
      expect(getBody(url)).to.equal(false);
      done();
    });
  });

  describe('setDomain', () => {
    before(() => setDomain(url));

    it('should return domain from url', (done) => {
      expect(getDomain()).to.be.equal('dbpedia.org');
      done();
    });
  });

  describe('hasResourceInPath', () => {
    it('should return on url with no resource in path', (done) => {
      expect(hasResourceInPath(url)).to.equal(false);
      done();
    });

    it('should return true on url with resource in path', (done) => {
      expect(hasResourceInPath('http://dbpedia.org/resource/Nanyue_Huisi')).to.equal(true);
      done();
    });

    it('should return true if resource is after domain', (done) => {
      expect(hasResourceInPath('http://dbpedia.org/resource/Nanyue_Huisi')).to.equal(true);
      done();
    });

    it('should return false if resource is not after domain', (done) => {
      expect(hasResourceInPath('http://dbpedia.org/random/resource/Nanyue_Huisi')).to.equal(false);
      done();
    });
  });

  describe('getRDFTripletObject', () => {
    const tripletUrl = 'http://dbpedia.org/resource/Nanyue_Huisi';
    it('should return an object', (done) => {

      getRDFTripletObject(tripletUrl).then(console.log);
      done();
    });
  });
});
