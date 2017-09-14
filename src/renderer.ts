import {render as appRender} from './process/renders/main/ui/render';
import {render as proxyBypassDomainSettingWindowRender} from './process/renders/proxy-bypass-domain-setting/ui/render';
import {render as rewriteRuleSettingWindowRender} from './process/renders/rewrite-rule-setting/ui/render';

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
