"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const report_item = (name) => {
    return {
        name: name,
        value: 0,
        formatted: '',
        count: 0,
        cached_count: 0,
        external_count: 0,
        local_count: 0,
        times: {
            end: 0,
            formatted: ''
        }
    };
};
exports.report = () => {
    return [
        report_item('Received Total'),
        report_item('Received Stylesheets'),
        report_item('Received Scripts'),
        report_item('Received HTML'),
        report_item('Received JSON'),
        report_item('Received Images'),
        report_item('Received Fonts'),
        report_item('Received Binary')
    ];
};
exports.find_report = (where, name) => where.find((media) => media.name === name);
exports.get_report = (where, type) => {
    let record = exports.find_report(where, type);
    if (!record) {
        record = report_item(type);
        where.push(record);
    }
    return record;
};
//# sourceMappingURL=report.js.map