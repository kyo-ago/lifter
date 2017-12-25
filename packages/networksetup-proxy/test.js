const assert = require("assert");
const NetworksetupProxy = require("./").NetworksetupProxy;

describe("networksetup-proxy", () => {
    let networksetupProxy;
    beforeEach(() => {
        networksetupProxy = new NetworksetupProxy();
    });

    it("should return escaped parameter when symbol", function() {
        assert.deepEqual(networksetupProxy.getSscapedParams(["hoge"]), ["hoge"]);
        assert.deepEqual(networksetupProxy.getSscapedParams([" "]), ['" "']);
        assert.deepEqual(networksetupProxy.getSscapedParams(["\\"]), ['"\\\\"']);
        assert.deepEqual(networksetupProxy.getSscapedParams([undefined, undefined]), ['""', '""']);
    });
});
