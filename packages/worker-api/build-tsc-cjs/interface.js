"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.isPubKeyPinPair = void 0;
function isPubKeyPinPair(pair) {
    return pair.pin !== undefined;
}
exports.isPubKeyPinPair = isPubKeyPinPair;
var Request;
(function (Request) {
    Request[Request["TrustedGetter"] = 0] = "TrustedGetter";
    Request[Request["PublicGetter"] = 1] = "PublicGetter";
    Request[Request["Worker"] = 2] = "Worker";
})(Request || (exports.Request = Request = {}));
