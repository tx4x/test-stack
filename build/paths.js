"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const url_1 = require("url");
exports.STATS_SUFFIX = '_stats.json';
exports.TRACE_SUFFIX = '_trace.json';
// utils to create output file name for url, format : hostname_time.json
const _url_short = (url) => new url_1.URL(url).hostname;
const _date_suffix = () => new Date().toLocaleTimeString().replace(/:/g, '_');
const _default_filename = (url) => `${_url_short(url)}_${_date_suffix()}`;
exports.default_path = (cwd, url) => `${path.join(cwd, _default_filename(url))}${exports.STATS_SUFFIX}`;
exports.default_trace_path = (cwd, url) => `${path.join(cwd, _default_filename(url))}${exports.TRACE_SUFFIX}`;
//# sourceMappingURL=paths.js.map