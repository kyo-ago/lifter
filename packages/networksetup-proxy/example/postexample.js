const fs = require("fs");
const p = fs.readFileSync("./package.json");
fs.writeFileSync("./package.json", String(p).replace(/"file:.+?"/, '"file:.."'));
