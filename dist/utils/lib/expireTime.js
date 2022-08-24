"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpired = void 0;
function ExpireTime(min) {
    let date = new Date();
    var dateMin = Number(date.getMinutes()) + min;
    date.setMinutes(dateMin).toLocaleTimeString;
    return date;
}
exports.default = ExpireTime;
function isExpired(expireTime) {
    let nowDate = new Date().toISOString();
    let expiredateTime = new Date(expireTime).toISOString();
    return nowDate.valueOf() > expiredateTime.valueOf() ? true : false;
}
exports.isExpired = isExpired;
