import {render as appRender} from "./main-window/ui/render";
import {render as rewriteRuleSettingWindowRender} from "./rewrite-rule-setting-window/ui/render";
import {render as proxyBypassDomainSettingWindowRender} from "./proxy-bypass-domain-setting-window/ui/render";

document.addEventListener('DOMContentLoaded', () => {
    [
        {
            elem: document.querySelector('#app'),
            render: appRender,
        },
        {
            elem: document.querySelector('#rewriteRuleSettingApp'),
            render: rewriteRuleSettingWindowRender,
        },
        {
            elem: document.querySelector('#proxyBypassDomainSettingApp'),
            render: proxyBypassDomainSettingWindowRender,
        },
    ].forEach((setting) => setting.elem && setting.render(setting.elem));
});
