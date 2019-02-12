"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const chalk_1 = require("chalk");
exports.rl = (prompt, onLine, onClose) => {
    const rl = readline_1.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk_1.default.green(prompt)
    });
    console.log('start stdin: ' + prompt);
    rl.prompt();
    rl.on('line', (line) => {
        if (!line) {
            return;
        }
        try {
            onLine(line);
        }
        catch (e) {
            console.error(e);
            rl.prompt();
        }
    });
    rl.on('close', () => {
        rl.close();
        onClose();
    });
    return rl;
};
//# sourceMappingURL=stdin.js.map