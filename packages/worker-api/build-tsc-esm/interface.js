export function isPubKeyPinPair(pair) {
    return pair.pin !== undefined;
}
export var Request;
(function (Request) {
    Request[Request["TrustedGetter"] = 0] = "TrustedGetter";
    Request[Request["PublicGetter"] = 1] = "PublicGetter";
    Request[Request["Worker"] = 2] = "Worker";
})(Request || (Request = {}));
