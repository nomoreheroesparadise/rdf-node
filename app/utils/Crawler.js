const rp = require('request-promise');
const cheerio = require('cheerio');
const parseUrl = require('node-parse-url');
const Promise = require('bluebird');
const queue = require('fastq')(worker, 1);
const ToDoModel = require('../models/ToDo');
const rdfFetch = require('rdf-fetch');
const _ = require('lodash');

// FIXME: DORZUCIC ldf-client i powyciagac biblioteki / poczyscic : )


const visitedUrls = new Map();
const toBeVisitedUrls = new Map();
const limit = 20;

function worker(url, cb) {
  Crawler.visitPage(url);
  cb(null);
}

//FIXME: domain is hardcoded
let domain;

class Crawler {
  static setDomain(url) {
    domain = parseUrl(url).domain;
  }

  static getBody(url) {
    Crawler.setDomain(url);

    if (Crawler.hasVisitedUrl(url)) {
      return false;
    }

    toBeVisitedUrls.delete(url);
    visitedUrls.set(url);

    return rp(url);
  }

  static getUrls(html) {
    return Promise.resolve(html)
      .then((body) => {
        const $ = cheerio.load(body);
        const links = $('a');
        $(links).each((i, link) => {
          try {
            const linkHref = $(link).attr('href');
            const urlArray = linkHref.split('://');
            if (urlArray.length === 2
              && urlArray[1].startsWith(domain)
              && !visitedUrls.has(linkHref)
              && !toBeVisitedUrls.has(linkHref)
              // TODO: Possibly not needed condition
              && Crawler.hasResourceInPath(linkHref)
            ) {
              toBeVisitedUrls.set(linkHref);
              if (visitedUrls.size < limit) {
                queue.push(linkHref);
              } else {
                queue.kill();
              }
            }
          } catch (err) {
          }
        });
      })
    ;
  }

  static hasResourceInPath(url) {
    const parsedUrl = parseUrl(url);
    const pathArray = parsedUrl.path.split('/');
    const resource = 'resource';

    if (_.indexOf(pathArray, resource) === -1
      || _.indexOf(pathArray, resource) !== 1
    ) {
      return false;
    }

    return true;
  }

  static visitPage(url) {
    Promise.resolve(Crawler.getBody(url))
      .tap((body) => {
        if (Crawler.hasResourceInPath(url)) {
          Promise.resolve(Crawler.getRDFTripletObject(url))
            .then((object) => {
              ToDoModel.create({
                url,
                body,
                rdfObject: object,
              });
            });
        }
      })
      .then((body) => {
        if (!body) {
          return false;
        }
        return Crawler.getUrls(body);
      });
  }

  static getRDFTripletObject(url) {
    return Promise.resolve(
      rdfFetch(url)
    )
    .then((res) => {
      const obj = {};
      return res.dataset()
        .then((data) => {
          data._quads.forEach((quad, i) => {
            obj[i] = {
              object: quad.object.value,
              predicate: quad.predicate.value,
              subject: quad.subject.value,
            };
          });
        })
        .then(() => {
          return obj;
        });
    });
  }


  static hasToBeVisitedUrl(url) {
    return toBeVisitedUrls.has(url);
  }

  static hasVisitedUrl(url) {
    return visitedUrls.has(url);
  }

  static getVisitedUrlsSize() {
    return visitedUrls.size;
  }

  static getDomain() {
    return domain;
  }

  static getToBeVisitedUrlsSize() {
    return toBeVisitedUrls.size;
  }
}

module.exports = Crawler;
