"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const log_1 = require("../log");
class Testing {
    static serve(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const serve = serveStatic('./public', {});
                const server = http_1.createServer((req, res) => {
                    serve(req, res, finalhandler(req, res));
                });
                server.listen(options.testAppPort);
                server.on('listening', () => {
                    log_1.log(`Server runs at : ${options.testAppUrl}:${options.testAppPort}/`);
                    resolve(server);
                });
            });
        });
    }
    static testBeacon(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const server = this.serve(options);
                server.then(() => {
                    log_1.log('Begin testing');
                });
            });
        });
    }
}
exports.Testing = Testing;
//# sourceMappingURL=index.js.map