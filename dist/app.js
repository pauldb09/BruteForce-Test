"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Manager_1 = require("./Manager");
const app = new Manager_1.passwordManager({
    generate: {
        maxAttemps: 30,
        generate: {
            length: 2,
            characters: ["A", "B", "C"]
        }
    },
    maxTries: 20
});
console.log("Starting");
app.on("loaded", () => {
    console.log("Loaded app!");
});
app.on("attemp", (event) => {
    console.log("Making attemp!");
    console.log(event);
});
app.on("found", (event) => {
    console.log(`The password is ${event.password}`);
});
app.on("close", (event) => {
    console.log(event);
});
//# sourceMappingURL=app.js.map