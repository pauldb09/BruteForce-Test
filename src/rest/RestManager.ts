const EventEmitter = require("events")
import type {
    RestManagerOptions,
    RestRequest
} from "../Types"

export class RestManager extends EventEmitter {

    public constructor(options: RestManagerOptions) {
        super();
        this.queue = [];
        this.options = options;
        this.manager = this.options.manager;
        this._tried = [];
        this.destroyed = false;
        this.sending = "no";
        this.rateLimited = false;

        this.on("end", (reason: string) => {
            if(this.destroyed) return
            this.sending = "no";
            if (this.queue.filter(x=>!this._tried.find(t=>t.password === x.password)).length) {
               return this.handle()
            }
            console.log(this.queue)
            let queue = this.queue;
            this.queue = [];
            this._tried = [];
            this.manager.handleEnd(reason,queue)
        })
    }

    public async addRequest(data: RestRequest) {
        this.queue.push(data);
        return data;
    }

    public async addRequests(data: Array<any>) {
        this.queue = data;
        return data;
    }

    public destroy(reason: string) {
        this.queue = [];
        this.manager.destroy()
        this.destroyed = true;
        this.sending = false;
        this.rateLimited = false;
        return this
    }

    public execute(data: any) {
        console.log(`${data.password}/${this.manager.password}`)
        if (data.password === this.manager.password) {
            this.manager.passwordFound = data.password;
            console.log(data.password)
            console.log("found")
            this.queue = []
            this.destroy("FOUND_PASSWORD")
        } else {
            this._tried.push(data)
        }
        return true
    }

    public handle() {
        if (this.rateLimited) return setTimeout(() => {
            this.handle()
        }, this.rateLimited);

        this.sending = "yes";
        let toMake = this.queue;
        let _pos = 0;
        toMake.forEach(request => {
            _pos++;
            this.execute(request);
            if (_pos == toMake.length) {
                this.emit("end", "QUEUE_CONCLUDED")
            }
        })
        return this
    }
}