const sinon = require("sinon");
const mockRequire = require("mock-require");
mockRequire("sudo-prompt", {
    exec: sinon.spy(),
});
const sudoPrompt = require("sudo-prompt");
const NetworksetupProxy = require("networksetup-proxy").NetworksetupProxy;
const networksetupProxy = new NetworksetupProxy();
networksetupProxy.hasGrant();
networksetupProxy.grant();
// console.log(sudoPrompt.exec);
