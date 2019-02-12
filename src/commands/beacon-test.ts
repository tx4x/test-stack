import * as CLI from 'yargs';
import { defaultOptions, sanitize } from '../argv';
import { Options } from '../';
import { render as output } from '../output';
import { Testing } from '../testing';

// no extra options, using defaults
const options = (yargs: CLI.Argv) => defaultOptions(yargs).option('testAppPort',{
    describe: 'The port of the test application',
    default: 3030
}).option('testAppUrl',{
    describe: 'The url of the served test application',
    default: 'http://localhost'
});

export const register = (cli: CLI.Argv) => {
    return cli.command('testBeacon', 'Tests a beacon payload', options, async (argv: CLI.Arguments) => {
        //@TODO: this guard might not be necessary
        if (argv.help) { return; }
        const args = sanitize(argv) as Options;
        const result = await Testing.testBeacon(args.url, args);
        output(result, args);
    });
};
