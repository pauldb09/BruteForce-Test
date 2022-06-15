"use strict";
/*eslint indent: ["error", "tab"]*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordManager = void 0;
const EventEmitter = require("events");
class passwordManager extends EventEmitter {
    constructor(options) {
        super();
        console.log("called manager");
        console.log(options);
        this.options = options;
        this.valitated = this._validate();
        this.state = 0;
        this.password = this.options.password || null;
        this.on("generated", (password) => {
            this.paswword = password;
            console.log(password);
        });
    }
    _clean() {
        this.removeAllListeners();
        return true;
    }
    start() {
    }
    async _validate() {
        let _success = true;
        let options = this.options;
        if (options.generate) {
            await this._generate(options.generate);
            options.characters = options.generate.characters;
        }
        else if (!options.password) {
            _success = false;
            console.error("[Options] Need a password generator or a pre-set password.");
        }
        return _success;
    }
    async _getReady() {
        return this.state === 1;
    }
    async _generate(args) {
        let word = "";
        let _this = this;
        for (let index = 0; index < args.length; index++) {
            word = `${word}${args.characters[Math.floor(Math.random() * args.characters.length)]}`;
            if (index === args.length) {
                _this.emit("generated", word);
            }
        }
        return word;
    }
}
exports.passwordManager = passwordManager;
//# sourceMappingURL=Manager.js.map