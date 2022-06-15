
const EventEmitter = require("events");
import type {
    PasswordManagerOptions as optionsManager,
    PasswordGenerateType as generateOptions,
    PasswordManagerEvent,
    RestRequest
} from "./Types";
import { RestManager } from "./rest/RestManager";

export class passwordManager extends EventEmitter {
    public constructor(options: optionsManager) {
        super();

        this.options = options
        this.state = 0;
        this.position = 0;
        this._attempts = [];
        this._value = "";
        this.destroyed = false;
        this.rest = new RestManager({ manager: this, timeout: 1000 });
        this.lastTries = [];
        this.password = this.options.password || null;
        this.passwordFound = this.options.password || null;
        this.characters = this.options.characters || null;

        this.rest.on("queueEnd", (reason: string, queue: [RestRequest]) => {
            console.log("YEAH")
            this.handleEnd(reason, queue)
        });

        this.on("generate", () => console.log("generate"), this.emit("passwordCreated", { code: 200, reason: "Found the password! Starting to get it with bruteforce", password: this.password }))
        this.on("loaded", () => console.log("loaded"), this.emit("ready", { code: 200, reason: "The client is now ready", password: this.password }))

        this._validate();
    }

    public handleEnd(reason: string, queue: [RestRequest]) {
        if (this.destroyed) return
        console.log(queue)
        this.emit("end", { code: 1000, reason: reason, queue: queue })
        if (reason === "FOUND_PASSWORD") {
            console.log(this.passwordFound)
            this.emit("found", this.passwordFound)
        } else if (reason === "QUEUE_CONCLUDED") {
            this.lastTries = queue;
            if (this.lol) return
            console.log(this.lastTries)
            if (!this.lol) this._nextChar()
            this.lol = true;
        }
    }

    public _clean() {
        return true;
    }

    public destroy() {
        this._clean();
        this.destroyed = true;
        return process.exit(0)

    }

    public _nextChar() {
        if (this.destroyed) return

        this.position++
        const chars = this.characters;
        if (this.position == 1) {
            let _chars = [];
            chars.forEach(char => {
                _chars.push({ password: char })
            })
            this.rest.addRequests(_chars)

            if (this.rest.sending === "no") {
                this.rest.sending = "yes";
                this.rest.handle();
            }

        } else {
            let finalTries = this.lastTries.length * chars.length;
            console.log(finalTries);
            let _pos = 0;
            const list = this.lastTries;
            this.lastTries = [];
            list.forEach(data => {
                chars.forEach(char => {
                    _pos++
                    let x = `${data.password}${char}`;
                    if (x === this.password) {
                        console.log(x)
                        console.log("right password")
                        this.destroy()
                        return
                    }
                    this.lastTries.push({ password: `${data.password}${char}` })
                    if (_pos === finalTries) {
                        this._nextChar()
                    }
                    //  this.rest.addRequest({ password: `${data.password}${char}` })
                    if (this.rest.sending === "no") {
                        this.rest.sending = "yes";
                        // this.rest.handle();
                    }

                })
            });
        }

    }

    public _start() {
        if (!this._getReady) return console.error("[Client not ready] Client hasn't entered ready yet");
        this.emit("loaded", true)
        this._nextChar();
    }

    public async _validate() {
        let _success = true;
        let options = this.options;
        if (options.generate) {
            this.characters = options.generate.characters;
            console.log(options.generate.characters)
            await this._generate(options.generate);
        } else {
            _success = false;
            this.password = options.password
            this.characters = options.characters
            console.log(this.characters)
            this._enterReady()
        }
        return _success
    }

    public async _getReady() {
        return this.state === 1;
    }

    public async _enterReady() {
        if (this.state == 1) return false
        else {
            console.log("starting")
            this.state = 1;
            this._start();
            return this;
        }
    }

    public async _generate(args: generateOptions) {
        let word = "";
        for (let index = 0; index < args.length; index++) {
            console.log(`Run ${index} times / ${args.length}`)
            word = `${word}${args.characters[Math.floor(Math.random() * args.characters.length)]}`;
            if ((index + 1) === args.length) {
                this.password = word;
                setTimeout(() => {
                    this.emit("generate")
                    this._enterReady()
                }, 3000)
            }
        }
        return word;
    }
}

