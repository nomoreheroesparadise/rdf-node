import * as express from 'express';
import * as rp from 'request-promise';
import  WAE from 'web-auto-extractor';

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    //TODO: extend WAE with proper rdflib support and rdfa
    router.get('/', (req, res) => {
      rp('http://schema.org/LocalBusiness')
        .then((html) => {
          const data = WAE().parse(html);
          console.log(data);
          // return res.json({
          //   message: data
          // });
        });
    })
    this.express.use('/', router)
  }
}

export default new App().express
