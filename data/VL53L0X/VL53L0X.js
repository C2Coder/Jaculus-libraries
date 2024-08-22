"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.VL53L0X = void 0;
exports.connect = connect;
/* Copyright (c) 2017 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission. */
// modified from Espruino's VL53L0X module (https://www.espruino.com/VL53L0X)
var C = {
    REG_SYSRANGE_START: 0,
    REG_RESULT_RANGE_STATUS: 0x0014
};
var VL53L0X = /** @class */ (function () {
    function VL53L0X(i2c) {
        this.i2c = i2c;
        this.ad = 0x52 >> 1;
        this.init();
    }
    /** initialise VL53L0X */
    VL53L0X.prototype.init = function () {
        this.w(0x80, 0x01);
        this.w(0xFF, 0x01);
        this.w(0x00, 0x00);
        this.StopVariable = this.r(0x91, 1)[0];
        this.w(0x00, 0x01);
        this.w(0xFF, 0x00);
        this.w(0x80, 0x00);
    };
    VL53L0X.prototype.r = function (addr, n) {
        this.i2c.writeTo(this.ad, addr);
        return this.i2c.readFrom(this.ad, n);
    };
    VL53L0X.prototype.w = function (addr, d) {
        this.i2c.writeTo(this.ad, [addr, d]);
    };
    /**
     * Perform one measurement and return the result.
     * Returns an object of the form:
     * {
     *   distance , // distance in mm
     *   signalRate, // target reflectance
     *   ambientRate, // ambient light.
     *   effectiveSpadRtnCount //  effective SPAD count for the return signal
     * }
     */
    VL53L0X.prototype.read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var d, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // start measurement
                        this.w(0x80, 0x01);
                        this.w(0xFF, 0x01);
                        this.w(0x00, 0x00);
                        this.w(0x91, this.StopVariable);
                        this.w(0x00, 0x01);
                        this.w(0xFF, 0x00);
                        this.w(0x80, 0x00);
                        // VL53L0X_DEVICEMODE_SINGLE_RANGING:
                        this.w(C.REG_SYSRANGE_START, 0x01);
                        _a.label = 1;
                    case 1:
                        if (!!(this.r(C.REG_RESULT_RANGE_STATUS, 1)[0] & 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sleep(1)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        d = new DataView(this.r(0x14, 12).buffer);
                        res = {
                            distance: d.getUint16(10),
                            signalRate: d.getUint16(6) / 128,
                            ambientRate: d.getUint16(8) / 128,
                            effectiveSpadRtnCount: d.getUint16(2) / 256
                        };
                        // TODO: use LinearityCorrectiveGain/etc
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return VL53L0X;
}());
exports.VL53L0X = VL53L0X;
function connect(i2c) {
    return new VL53L0X(i2c);
}
;
