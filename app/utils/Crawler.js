const rp = require('request-promise');
const cheerio = require('cheerio');
const parseUrl = require('node-parse-url');
const Promise = require('bluebird');
const queue = require('fastq')(worker, 1);
const ToDoModel = require('../models/ToDo');
const rdfFetch = require('rdf-fetch');
const _ = require('lodash');
const microdata = require('microdata-node');
var parser = require('rdf-nx-parser');
const JSONLDParser = require('rdf-parser-jsonld');
const stringToStream = require('string-to-stream')

const visitedUrls = new Map();
const toBeVisitedUrls = new Map();
let limit = 20;

function worker(object, cb) {
  Crawler.visitPage(object.url, object.type);
  cb(null);
}

let protocol;
let domain;

class Crawler {
  static flushAllUrls() {
    visitedUrls.clear();
    toBeVisitedUrls.clear();
  }

  static setDomainInfo(url) {
    domain = parseUrl(url).domain;
    protocol = parseUrl(url).protocol;
  }

  static getBody(url) {
    Crawler.setDomainInfo(url);

    if (Crawler.hasVisitedUrl(url)) {
      return false;
    }

    toBeVisitedUrls.delete(url);
    visitedUrls.set(url);

    const options = {
      uri: url,
      insecure: true,
      rejectUnauthorized: false
    };

    return rp(options)
      .catch(e => {});
  }

  static getUrls(html, type, onlyDomain) {
    return Promise.resolve(html)
      .then((body) => {
        const $ = cheerio.load(body);
        const links = $('a');
        $(links).each((i, link) => {
          try {
            let linkHref = $(link).attr('href');
            let additionalCondition;
            if (type === 'rdf') {
              additionalCondition = Crawler.hasResourceInPath(linkHref);
            } else {
              additionalCondition = true;
            }

            if (linkHref.startsWith('/')
              && !linkHref.startsWith('//')
            ) {
              linkHref = `${protocol}//${domain}${linkHref}`;
            }
            const urlArray = linkHref.split('://');

            let domainCondition;

            if(onlyDomain === true) {
              domainCondition = urlArray[1].startsWith(domain);
            } else {
              domainCondition = true;
            }

            if (
              !(/\.(png|jpg|gif|js|pdf|css|ico)$/).test(linkHref)
              && urlArray.length === 2
              && domainCondition
              && !visitedUrls.has(linkHref)
              && !toBeVisitedUrls.has(linkHref)
              && additionalCondition
            ) {
              toBeVisitedUrls.set(linkHref);
              if (visitedUrls.size < limit) {
                queue.push({
                  url: linkHref,
                  type,
                });
              } else {
                console.log('Finished crawling: ', Date.now())
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

  static visitPage(url, type, onlyDomain, limit) {
    limit = limit;

    Promise.resolve(Crawler.getBody(url))
      .tap((body) => {
        let getData;
        if (type === 'rdf' && Crawler.hasResourceInPath(url)) {
          getData = Crawler.getRDFTripletObject(url);
        } else {
          getData = Crawler.getJSONLDdata(body, url);
        }

        Promise.resolve(getData)
          .then((object) => {
            if (_.isArray(object)) {
              let result = object;
              try {
                ToDoModel.create({
                  url,
                  body,
                  object: result,
                  type,
                });
              } catch (error) {
              }
            }
          })
          .catch(e => {})
      })
      .then((body) => {
        if (!body) {
          return false;
        }
        return Crawler.getUrls(body, type, onlyDomain);
      })
      .catch(e => {});
  }

  static getRDFTripletObject(url) {
    return Promise.resolve(
      rdfFetch(url)
    )
    .then((res) => {
      const obj = [];
      return res.dataset()
        .then((data) => {
          data._quads.forEach((quad) => {
            obj.push({
              object: quad.object.value,
              predicate: quad.predicate.value,
              subject: quad.subject.value,
            });
          });
        })
        .then(() => {
          return obj;
        });
    });
  }

  static getJSONLDdata(html, url) {
    return Promise.resolve(
      cheerio.load(html, {xml: true})
    )
    .then((data) => JSON.parse(data('script[type="application/ld+json"]')[0].children[0].data))
    .then((data) => {
      const parser = new JSONLDParser();

      let stream = parser.import(stringToStream(JSON.stringify(data)))

      let output = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (triple) => {
          output.push({
            subject: triple['subject'].value,
            predicate: triple['predicate'].value,
            object: triple['object'].value
          });
        })

        stream.on('end', () => {
          resolve(output)
        });
      })
    })
    .catch((e) => {})
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


  static getVisitedUrlsentries() {
    return visitedUrls.entries();
  }

  static getToBeVisitedUrlsentries() {
    return toBeVisitedUrls.entries();
  }

  static getDomain() {
    return domain;
  }

  static getToBeVisitedUrlsSize() {
    return toBeVisitedUrls.size;
  }
}

module.exports = Crawler;
