"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const rp = require("request-promise");
const web_auto_extractor_1 = require("web-auto-extractor");
class App {
    constructor() {
        this.express = express();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express.Router();
        //TODO: extend WAE with proper rdflib support and rdfa
        router.get('/', (req, res) => {
            rp('http://schema.org/LocalBusiness')
                .then((html) => {
                const data = web_auto_extractor_1.default().parse(html);
                console.log(data);
                // return res.json({
                //   message: data
                // });
            });
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map