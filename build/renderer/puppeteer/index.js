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
const puppeteer_1 = require("puppeteer");
const fs_1 = require("fs");
const remove_1 = require("@xblox/fs/remove");
const iterator_1 = require("@xblox/fs/iterator");
const __1 = require("../../");
const trace_1 = require("./trace");
const stdin_1 = require("./stdin");
const report_1 = require("./report");
const url_1 = require("url");
const included_categories = ['devtools.timeline'];
const debug_plain = true;
const debug_events = false;
const debug_normal = true;
const parse_events = (postData) => {
    if (postData.indexOf('viewId') > 1 && postData.indexOf('[{') && postData.indexOf(']}')) {
        try {
            const main = JSON.parse(postData.substring(postData.indexOf('[{'), postData.lastIndexOf('}]') + 2));
            let ts;
            let inner = '{}';
            if (main[0].payload) {
                inner = main[0].payload.substring(main[0].payload.indexOf(',') + 1);
                ts = main[0].payload.substring(0, main[0].payload.indexOf(','));
                delete main[0].payload;
            }
            return Object.assign({}, main[0], { payloadTS: ts, payload: JSON.parse(inner) });
        }
        catch (e) {
            __1.error('er ', e);
        }
    }
    else {
        // console.log('not an event payload');
    }
};
exports.logRequest = (request) => {
    const url = decodeURIComponent(request.url());
    const parsed = url_1.parse(url, true);
    const url_path = parsed.path;
    if (!request || !request.url()) {
        return;
    }
    const type = request.headers()['content-type'];
    // cases 
    if (type && type.startsWith('text/plain')) {
        //inspect('Request ' + url, decodeURIComponent(request.postData()));
        //inspect('Request ' + url, data);
    }
    const postData = request.postData();
    if (!postData) {
        return;
    }
    if (debug_events) {
        const events = parse_events(postData);
        if (events) {
            __1.inspect('Events : ', events);
            return;
        }
        else {
            //console.log('invalid events ', postData);
        }
    }
    //const t = [{"viewId":"1534261630723","type":"resolution","time":1534261631731,"payload":"1534261630724,[{"time":1534261630727,"type":"resize","width":800,"height":600},{"time":1534261631647,"type":"move","targetId":7,"x":100,"y":148},{"time":1534261631683,"type":"click","targetId":7,"x":100,"y":148},{"time":1534261631689,"type":"move","targetId":6,"x":0,"y":0},{"time":1534261631691,"type":"move","targetId":7,"x":0,"y":100}]
    debug_plain && __1.inspect('Request ' + url_path.substr(0, 20) + ' type ' + type, {
        headers: request.headers(),
        data: request.postData(),
        query: parsed.query
    });
};
class Puppeteer {
    static doActions(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const mouse = page.mouse;
            // move 
            const mOpts = {
                steps: 20
            };
            /*
            await mouse.move(0, 0);
            await mouse.move(0, 20, mOpts);
            await mouse.move(0, 40, mOpts);
            await mouse.move(300, 100, mOpts);
            await mouse.click(400, 200);*/
        });
    }
    static clean(url, options) {
        iterator_1.async(options.cwd, {
            matching: [`*${__1.STATS_SUFFIX}`, `*${__1.TRACE_SUFFIX}`]
        }).then((it) => {
            let node = null;
            while (node = it.next()) {
                remove_1.sync(node.path);
            }
        });
    }
    static begin(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.launch({
                headless: options.headless,
                devtools: true
            });
            return yield browser.newPage();
        });
    }
    static crawler(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.begin(url, options);
        });
    }
    static repl(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.begin(url, options);
            page.on('console', msg => __1.inspect('Console Message:', msg.text()));
            yield page.goto(url, {
                timeout: 2000,
                waitUntil: 'networkidle2'
            });
            stdin_1.rl(`${url}#`, (line) => {
                page.evaluate(line).then((results) => {
                    __1.inspect(`Did evaluate ${line} to `, results);
                });
            }, () => this.end(page));
        });
    }
    static agent(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.begin(url, options);
            //!msg.text().indexOf('｢hot｣')
            page.on('console', msg => __1.inspect('Console Message:', msg.text()));
            __1.log('Open Agent at url   ' + url);
            yield page.setRequestInterception(true);
            page.on('request', interceptedRequest => {
                // inspect('request ' + interceptedRequest.url(), interceptedRequest.postData());
                // 
                exports.logRequest(interceptedRequest);
                interceptedRequest.continue();
                /*
                if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
                    interceptedRequest.abort();
                else
                    interceptedRequest.continue();
                    */
            });
            yield page.goto(url, {
                timeout: 2000,
                waitUntil: 'networkidle2'
            });
            const [response] = yield Promise.all([
                page.click('#root', {
                    button: 'left'
                })
            ]);
            yield this.doActions(page);
            // await this.stopRecording(page);
            const readline = stdin_1.rl(`${url}#`, (line) => {
                page.evaluate(line).then((results) => {
                    __1.inspect(`Did evaluate ${line} to `, results);
                });
            }, () => this.end(page));
            //http://localhost:8020/ruxit/cache/js/lib/decoder.ww.js:formatted
            let end = false;
            if (end) {
                setTimeout(() => {
                    page.mouse.click(300, 300);
                    page.goto('0.0.0.0').catch(() => {
                        this.end(page);
                        __1.error('end ');
                        readline.close();
                    });
                }, 4000);
            }
            //await this.end(page);
        });
    }
    static stopRecording(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const [response] = yield Promise.all([
                page.click('#stop', {
                    button: 'left'
                })
            ]);
        });
    }
    static end(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield page.browser();
            yield page.close();
            yield browser.close();
        });
    }
    static summary(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.launch({
                headless: options.headless,
                devtools: true
            });
            const page = yield browser.newPage();
            yield page.goto(url, {
                timeout: 600000,
                waitUntil: 'networkidle0'
            });
            const metrics = yield page.metrics();
            yield this.end(page);
            return metrics;
        });
    }
    static detail(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const network_stats = report_1.report();
            const ReceivedTotal = report_1.get_report(network_stats, 'Received Total');
            const ReceivedStyleSheets = report_1.get_report(network_stats, 'Received Stylesheets');
            const ReceivedScripts = report_1.get_report(network_stats, 'Received Scripts');
            const ReceivedHTML = report_1.get_report(network_stats, 'Received HTML');
            const ReceivedImages = report_1.get_report(network_stats, 'Received Images');
            const ReceivedJSON = report_1.get_report(network_stats, 'Received JSON');
            const ReceivedFonts = report_1.get_report(network_stats, 'Received Fonts');
            const ReceivedBinary = report_1.get_report(network_stats, 'Received Binary');
            const MimeMap = {
                'application/javascript': ReceivedScripts,
                'text/javascript': ReceivedScripts,
                'text/css': ReceivedStyleSheets,
                'text/html': ReceivedHTML,
                'image/png': ReceivedImages,
                'image/gif': ReceivedImages,
                'image/svg+xml': ReceivedImages,
                'application/json': ReceivedJSON,
                'application/octet-stream': ReceivedBinary,
                'font/woff2': ReceivedFonts,
                'application/font-woff2': ReceivedFonts
            };
            const traceFile = __1.default_trace_path(options.cwd, url);
            const page = yield this.begin(url, options);
            yield page.tracing.start({
                path: traceFile,
                categories: included_categories
            });
            yield page.goto(url, {
                timeout: 600000,
                waitUntil: 'networkidle0'
            });
            const metrics = yield page._client.send('Performance.getMetrics');
            const nowTs = new Date().getTime();
            // const navigationStart = getTimeFromMetrics(metrics, 'NavigationStart');
            const navigationStart = trace_1.find_time(metrics, 'Timestamp') + nowTs;
            yield page.tracing.stop();
            // --- extracting data from trace.json ---
            const tracing = JSON.parse(fs_1.readFileSync(traceFile, 'utf8'));
            const dataReceivedEvents = tracing.traceEvents.filter(x => x.name === 'ResourceReceivedData');
            const dataResponseEvents = tracing.traceEvents.filter(x => x.name === 'ResourceReceiveResponse');
            // find resource in responses or return default empty
            const content_response = (requestId) => dataResponseEvents.find((x) => x.args.data.requestId === requestId)
                || { args: { data: { encodedDataLength: 0 } } };
            const report_per_mime = (mime) => MimeMap[mime] || report_1.get_report(network_stats, mime);
            // our iteration over the trace
            // @TODO: convert to a better tree structure to avoid O(n) lookups
            // @TODO: emit to extensions: events & aspects
            // @TODO: calculate times
            // @TODO: filter
            // @TODO: options.mask
            // @TODO: this iterator might get async
            ReceivedTotal.value = dataReceivedEvents.reduce((first, x) => {
                const content = content_response(x.args.data.requestId);
                const data = content.args.data;
                const report = report_per_mime(data.mimeType);
                if (data.fromCache === false) {
                    report.value += x.args.data.encodedDataLength;
                    report.count++;
                }
                else {
                    report.cached_count++;
                }
                ReceivedTotal.count++;
                return first + x.args.data.encodedDataLength;
            }, ReceivedTotal.value);
            // calulate finals
            [ReceivedTotal, ReceivedHTML, ReceivedImages, ReceivedJSON,
                ReceivedScripts, ReceivedFonts, ReceivedBinary
            ].forEach((r) => r.formatted = __1.sizeToString(r.value));
            // --- end extracting data from trace.json ---
            let results = [];
            // lights off
            yield this.end(page);
            return {
                times: [],
                network: network_stats
            };
        });
    }
}
exports.Puppeteer = Puppeteer;
//# sourceMappingURL=index.js.map