require("jsdom-global")();

// for element-dialog
let style = document.createElement("style");
style.type = "text/css";
style.appendChild(
    document.createTextNode(`
    .el-dialog__wrapper {
        transition-delay: 0;
        transition-duration: 0;
        animation-delay: 0;
        animation-duration: 0;
    }
`),
);
document.head.appendChild(style);

global.process.env.NODE_ENV = "test";
