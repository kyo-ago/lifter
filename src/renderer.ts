import {render as appRender} from "./windows/main/ui/render";
import {render as rewriteRuleSettingWindowRender} from "./windows/rewrite-rule-setting/ui/render";
import {render as proxyBypassDomainSettingWindowRender} from "./windows/proxy-bypass-domain-setting/ui/render";

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
