declare const EventEmitter: any;
import type { PasswordManagerOptions as optionsManager } from "./Types";
export declare class passwordManager<T = unknown> extends EventEmitter {
    constructor(options: optionsManager);
    private _clean;
    private start;
    private _validate;
    private _getReady;
    private _generate;
}
export {};
