import { render as appRender } from "./main/ui/render";
import { render as proxyBypassDomainSettingWindowRender } from "./proxy-bypass-domain-setting/ui/render";
import { render as rewriteRuleSettingWindowRender } from "./rewrite-rule-setting/ui/render";

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");

document.addEventListener("DOMContentLoaded", () => {
    [
        {
            elem: document.querySelector("#app"),
            render: appRender
        },
        {
            elem: document.querySelector("#rewriteRuleSettingApp"),
            render: rewriteRuleSettingWindowRender
        },
        {
            elem: document.querySelector("#proxyBypassDomainSettingApp"),
            render: proxyBypassDomainSettingWindowRender
        }
    ].forEach(setting => setting.elem && setting.render(setting.elem));
});
