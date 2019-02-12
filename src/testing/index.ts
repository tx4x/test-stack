import { Options } from '../';
import { createServer } from 'http';
import * as finalhandler from 'finalhandler';
import * as serveStatic from 'serve-static';
import { log } from '../log';

export class Testing {

    static async serve(options: Options) {
        return new Promise((resolve, reject) => {
            const serve = serveStatic('./public', {});

            const server = createServer((req, res) => {
                serve(req as any, res as any, finalhandler(req, res));

            });
            server.listen(options.testAppPort);
            server.on('listening', () => {
                log(`Server runs at : ${options.testAppUrl}:${options.testAppPort}/`);
                resolve(server);
            });
        });
    }

    static async testBeacon(url: string, options: Options) {
        return new Promise((resolve, reject) => {
            const server = this.serve(options);
            server.then(() => {
                log('Begin testing');
            });
        })
    }
}