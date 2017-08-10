import {render as appRender} from "./main-window/ui/render";
import {render as rewriteRuleSettingWindowRender} from "./rewrite-rule-setting-window/ui/render";

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
    ].forEach((setting) => setting.elem && setting.render(setting.elem));
});
