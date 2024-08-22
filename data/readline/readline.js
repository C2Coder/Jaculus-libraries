"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readline = void 0;
var stdio_1 = require("stdio");
/**
 * A class for reading standard input line by line.
 */
var readline = /** @class */ (function () {
    function readline(echo) {
        if (echo === void 0) { echo = false; }
        this.buffer = "";
        this.promise = null;
        this.resolve = null;
        this.reject = null;
        this.closed = false;
        this.echo = echo;
    }
    readline.prototype.onGet = function (str) {
        var _this = this;
        if (this.echo) {
            stdio_1.stdout.write(str);
        }
        if (str == "\n") {
            if (this.resolve) {
                this.resolve(this.buffer);
            }
            this.buffer = "";
            this.promise = null;
            this.resolve = null;
            this.reject = null;
            return;
        }
        this.buffer += str;
        if (!this.closed) {
            stdio_1.stdin.get()
                .then(function (data) { return _this.onGet(data); })
                .catch(function (reason) {
                if (_this.reject) {
                    _this.reject(reason);
                }
            });
        }
    };
    readline.prototype.read = function () {
        var _this = this;
        if (this.promise != null) {
            return Promise.reject("Already reading");
        }
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        stdio_1.stdin.get()
            .then(function (data) { return _this.onGet(data); })
            .catch(function (reason) {
            if (_this.reject) {
                _this.reject(reason);
            }
        });
        return this.promise;
    };
    readline.prototype.close = function () {
        this.closed = true;
        if (this.reject) {
            this.reject("Stopped");
        }
        this.buffer = "";
        this.promise = null;
        this.resolve = null;
        this.reject = null;
    };
    return readline;
}());
exports.readline = readline;
