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
exports.RestManager = void 0;
var EventEmitter = require("events");
var RestManager = /** @class */ (function (_super) {
    __extends(RestManager, _super);
    function RestManager(options) {
        var _this = _super.call(this) || this;
        _this.queue = [];
        _this.options = options;
        _this.manager = _this.options.manager;
        _this._tried = [];
        _this.destroyed = false;
        _this.sending = "no";
        _this.rateLimited = false;
        _this.on("end", function (reason) {
            if (_this.destroyed)
                return;
            _this.sending = "no";
            if (_this.queue.filter(function (x) { return !_this._tried.find(function (t) { return t.password === x.password; }); }).length) {
                return _this.handle();
            }
            console.log(_this.queue);
            var queue = _this.queue;
            _this.queue = [];
            _this._tried = [];
            _this.manager.handleEnd(reason, queue);
        });
        return _this;
    }
    RestManager.prototype.addRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.queue.push(data);
                return [2 /*return*/, data];
            });
        });
    };
    RestManager.prototype.addRequests = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.queue = data;
                return [2 /*return*/, data];
            });
        });
    };
    RestManager.prototype.destroy = function (reason) {
        this.queue = [];
        this.manager.destroy();
        this.destroyed = true;
        this.sending = false;
        this.rateLimited = false;
        return this;
    };
    RestManager.prototype.execute = function (data) {
        console.log("".concat(data.password, "/").concat(this.manager.password));
        if (data.password === this.manager.password) {
            this.manager.passwordFound = data.password;
            console.log(data.password);
            console.log("found");
            this.queue = [];
            this.destroy("FOUND_PASSWORD");
        }
        else {
            this._tried.push(data);
        }
        return true;
    };
    RestManager.prototype.handle = function () {
        var _this = this;
        if (this.rateLimited)
            return setTimeout(function () {
                _this.handle();
            }, this.rateLimited);
        this.sending = "yes";
        var toMake = this.queue;
        var _pos = 0;
        toMake.forEach(function (request) {
            _pos++;
            _this.execute(request);
            if (_pos == toMake.length) {
                _this.emit("end", "QUEUE_CONCLUDED");
            }
        });
        return this;
    };
    return RestManager;
}(EventEmitter));
exports.RestManager = RestManager;
//# sourceMappingURL=RestManager.js.map