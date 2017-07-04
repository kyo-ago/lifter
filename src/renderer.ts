import {render as appRender} from "./ui/app/render";
import {render as rewriteRuleSettingWindowRender} from "./ui/rewrite-rule-setting-window/render";

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
