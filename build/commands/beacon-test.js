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
const argv_1 = require("../argv");
const output_1 = require("../output");
const testing_1 = require("../testing");
// no extra options, using defaults
const options = (yargs) => argv_1.defaultOptions(yargs).option('testAppPort', {
    describe: 'The port of the test application',
    default: 3030
}).option('testAppUrl', {
    describe: 'The url of the served test application',
    default: 'http://localhost'
});
exports.register = (cli) => {
    return cli.command('testBeacon', 'Tests a beacon payload', options, (argv) => __awaiter(this, void 0, void 0, function* () {
        //@TODO: this guard might not be necessary
        if (argv.help) {
            return;
        }
        const args = argv_1.sanitize(argv);
        const result = yield testing_1.Testing.testBeacon(args.url, args);
        output_1.render(result, args);
    }));
};
//# sourceMappingURL=beacon-test.js.map