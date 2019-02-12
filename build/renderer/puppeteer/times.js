"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.end_time = (entry) => {
    const timing = entry.args.data.timing;
    const start = timing.requestTime;
    const received = entry.ts;
    //it might be more accurate to calc this with the header times
    const headersReceived = start + timing.receiveHeadersEnd / 1000;
    let responseReceived = headersReceived;
    responseReceived = Math.min(responseReceived, headersReceived);
    responseReceived = Math.max(responseReceived, start);
    return Math.max(-1, responseReceived);
};
//# sourceMappingURL=times.js.map