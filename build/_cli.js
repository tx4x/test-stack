"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tweaks and handlers
exports.defaults = () => {
    // default command
    const DefaultCommand = 'testBeacon';
    if (process.argv.length === 2) {
        process.argv.push(DefaultCommand);
    }
    // currently no default handler, display only :
    process.on('unhandledRejection', (reason) => {
        console.error('Unhandled rejection, reason: ', reason);
    });
};
//# sourceMappingURL=_cli.js.map