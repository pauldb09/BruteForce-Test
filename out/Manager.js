"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordManager = void 0;
var EventEmitter = require("events");
var RestManager_1 = require("./rest/RestManager");
var passwordManager = /** @class */ (function (_super) {
    __extends(passwordManager, _super);
    function passwordManager(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.state = 0;
        _this.position = 0;
        _this._attempts = [];
        _this._value = "";
        _this.destroyed = false;
        _this.rest = new RestManager_1.RestManager({ manager: _this, timeout: 1000 });
        _this.lastTries = [];
        _this.password = _this.options.password || null;
        _this.passwordFound = _this.options.password || null;
        _this.characters = _this.options.characters || null;
        _this.rest.on("queueEnd", function (reason, queue) {
            console.log("YEAH");
            _this.handleEnd(reason, queue);
        });
        _this.on("generate", function () { return console.log("generate"); }, _this.emit("passwordCreated", { code: 200, reason: "Found the password! Starting to get it with bruteforce", password: _this.password }));
        _this.on("loaded", function () { return console.log("loaded"); }, _this.emit("ready", { code: 200, reason: "The client is now ready", password: _this.password }));
        _this._validate();
        return _this;
    }
    passwordManager.prototype.handleEnd = function (reason, queue) {
        if (this.destroyed)
            return;
        console.log(queue);
        this.emit("end", { code: 1000, reason: reason, queue: queue });
        if (reason === "FOUND_PASSWORD") {
            console.log(this.passwordFound);
            this.emit("found", this.passwordFound);
        }
        else if (reason === "QUEUE_CONCLUDED") {
            this.lastTries = queue;
            if (this.lol)
                return;
            console.log(this.lastTries);
            if (!this.lol)
                this._nextChar();
            this.lol = true;
        }
    };
    passwordManager.prototype._clean = function () {
        return true;
    };
    passwordManager.prototype.destroy = function () {
        this._clean();
        this.destroyed = true;
        return process.exit(0);
    };
    passwordManager.prototype._nextChar = function () {
        var _this = this;
        if (this.destroyed)
            return;
        this.position++;
        var chars = this.characters;
        if (this.position == 1) {
            var _chars_1 = [];
            chars.forEach(function (char) {
                _chars_1.push({ password: char });
            });
            this.rest.addRequests(_chars_1);
            if (this.rest.sending === "no") {
                this.rest.sending = "yes";
                this.rest.handle();
            }
        }
        else {
            var finalTries_1 = this.lastTries.length * chars.length;
            console.log(finalTries_1);
            var _pos_1 = 0;
            var list = this.lastTries;
            this.lastTries = [];
            list.forEach(function (data) {
                chars.forEach(function (char) {
                    _pos_1++;
                    var x = "".concat(data.password).concat(char);
                    if (x === _this.password) {
                        console.log(x);
                        console.log("right password");
                        _this.destroy();
                        return;
                    }
                    _this.lastTries.push({ password: "".concat(data.password).concat(char) });
                    if (_pos_1 === finalTries_1) {
                        _this._nextChar();
                    }
                    //  this.rest.addRequest({ password: `${data.password}${char}` })
                    if (_this.rest.sending === "no") {
                        _this.rest.sending = "yes";
                        // this.rest.handle();
                    }
                });
            });
        }
    };
    passwordManager.prototype._start = function () {
        if (!this._getReady)
            return console.error("[Client not ready] Client hasn't entered ready yet");
        this.emit("loaded", true);
        this._nextChar();
    };
    passwordManager.prototype._validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _success, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _success = true;
                        options = this.options;
                        if (!options.generate) return [3 /*break*/, 2];
                        this.characters = options.generate.characters;
                        console.log(options.generate.characters);
                        return [4 /*yield*/, this._generate(options.generate)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _success = false;
                        this.password = options.password;
                        this.characters = options.characters;
                        console.log(this.characters);
                        this._enterReady();
                        _a.label = 3;
                    case 3: return [2 /*return*/, _success];
                }
            });
        });
    };
    passwordManager.prototype._getReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.state === 1];
            });
        });
    };
    passwordManager.prototype._enterReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.state == 1)
                    return [2 /*return*/, false];
                else {
                    console.log("starting");
                    this.state = 1;
                    this._start();
                    return [2 /*return*/, this];
                }
                return [2 /*return*/];
            });
        });
    };
    passwordManager.prototype._generate = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var word, index;
            var _this = this;
            return __generator(this, function (_a) {
                word = "";
                for (index = 0; index < args.length; index++) {
                    console.log("Run ".concat(index, " times / ").concat(args.length));
                    word = "".concat(word).concat(args.characters[Math.floor(Math.random() * args.characters.length)]);
                    if ((index + 1) === args.length) {
                        this.password = word;
                        setTimeout(function () {
                            _this.emit("generate");
                            _this._enterReady();
                        }, 3000);
                    }
                }
                return [2 /*return*/, word];
            });
        });
    };
    return passwordManager;
}(EventEmitter));
exports.passwordManager = passwordManager;
//# sourceMappingURL=Manager.js.map