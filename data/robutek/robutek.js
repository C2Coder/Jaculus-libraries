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
exports.rightMotor = exports.leftMotor = exports.Pins = exports.PenPos = void 0;
exports.readSensor = readSensor;
exports.setSpeed = setSpeed;
exports.getSpeed = getSpeed;
exports.move = move;
exports.rotate = rotate;
exports.stop = stop;
var adc = require("adc");
var gpio = require("gpio");
var motor = require("motor");
var ledc = require("ledc");
var robutekDiameter = 80; // mm
var wheelDiameter = 33.3; // mm
var wheelCircumference = Math.PI * wheelDiameter;
var PenPos;
(function (PenPos) {
    PenPos[PenPos["Down"] = 562] = "Down";
    PenPos[PenPos["Up"] = 332] = "Up";
    PenPos[PenPos["Unload"] = 150] = "Unload";
})(PenPos || (exports.PenPos = PenPos = {}));
var Pins;
(function (Pins) {
    Pins[Pins["StatusLED"] = 46] = "StatusLED";
    // Jedna na desce a zároveň vývod pro pásek,
    // po připojení externího pásku se tedy jedná
    // o 8 + 1 = 9 diod celkem
    Pins[Pins["ILED"] = 48] = "ILED";
    Pins[Pins["ButtonLeft"] = 2] = "ButtonLeft";
    Pins[Pins["ButtonRight"] = 0] = "ButtonRight";
    Pins[Pins["Servo1"] = 21] = "Servo1";
    Pins[Pins["Servo2"] = 38] = "Servo2";
    Pins[Pins["Sens1"] = 4] = "Sens1";
    Pins[Pins["Sens2"] = 5] = "Sens2";
    Pins[Pins["Sens3"] = 6] = "Sens3";
    Pins[Pins["Sens4"] = 7] = "Sens4";
    Pins[Pins["SensSW"] = 8] = "SensSW";
    Pins[Pins["SensEN"] = 47] = "SensEN";
    Pins[Pins["Motor1A"] = 11] = "Motor1A";
    Pins[Pins["Motor1B"] = 12] = "Motor1B";
    Pins[Pins["Motor2A"] = 45] = "Motor2A";
    Pins[Pins["Motor2B"] = 13] = "Motor2B";
    Pins[Pins["Enc1A"] = 39] = "Enc1A";
    Pins[Pins["Enc1B"] = 40] = "Enc1B";
    Pins[Pins["Enc2A"] = 42] = "Enc2A";
    Pins[Pins["Enc2B"] = 41] = "Enc2B";
})(Pins || (exports.Pins = Pins = {}));
var sw = 0;
function switchSensors(toValue) {
    if (toValue == sw) {
        return;
    }
    sw = toValue;
    gpio.write(Pins.SensSW, toValue);
    // don't do this at home
    var start = Date.now();
    while (Date.now() - start < 2)
        ;
}
function readSensor(sensor) {
    switch (sensor) {
        case "WheelFR" /* SensorType.WheelFR */:
            switchSensors(0);
            return adc.read(Pins.Sens1);
        case "WheelFL" /* SensorType.WheelFL */:
            switchSensors(0);
            return adc.read(Pins.Sens2);
        case "WheelBL" /* SensorType.WheelBL */:
            switchSensors(0);
            return adc.read(Pins.Sens3);
        case "WheelBR" /* SensorType.WheelBR */:
            switchSensors(0);
            return adc.read(Pins.Sens4);
        case "LineFR" /* SensorType.LineFR */:
            switchSensors(1);
            return adc.read(Pins.Sens1);
        case "LineFL" /* SensorType.LineFL */:
            switchSensors(1);
            return adc.read(Pins.Sens2);
        case "LineBL" /* SensorType.LineBL */:
            switchSensors(1);
            return adc.read(Pins.Sens3);
        case "LineBR" /* SensorType.LineBR */:
            switchSensors(1);
            return adc.read(Pins.Sens4);
        default:
            throw new Error('Invalid sensor type');
    }
}
ledc.configureTimer(0, 64000, 10);
var leftMotorPins = { motA: Pins.Motor1A, motB: Pins.Motor1B, encA: Pins.Enc1A, encB: Pins.Enc1B };
var rightMotorPins = { motA: Pins.Motor2A, motB: Pins.Motor2B, encA: Pins.Enc2A, encB: Pins.Enc2B };
var leftMotorLedc = { timer: 0, channelA: 0, channelB: 1 };
var rightMotorLedc = { timer: 0, channelA: 2, channelB: 3 };
exports.leftMotor = new motor.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: 410, circumference: wheelCircumference });
exports.rightMotor = new motor.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: 410, circumference: wheelCircumference });
adc.configure(Pins.Sens1, adc.Attenuation.Db0);
adc.configure(Pins.Sens2, adc.Attenuation.Db0);
adc.configure(Pins.Sens3, adc.Attenuation.Db0);
adc.configure(Pins.Sens4, adc.Attenuation.Db0);
gpio.pinMode(Pins.SensEN, gpio.PinMode.OUTPUT);
gpio.write(Pins.SensEN, 1);
gpio.pinMode(Pins.SensSW, gpio.PinMode.OUTPUT);
var speed = 0;
function setSpeed(value) {
    speed = value;
}
function getSpeed() {
    return speed;
}
/**
 * Move the robot
 * @param curve number in range -1 to 1, where -1 is full left, 0 is straight and 1 is full right
 * @param duration optional duration of the move
 */
function move(curve, duration) {
    return __awaiter(this, void 0, void 0, function () {
        var lMot, rMot, hasTime, hasDistance, distance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lMot = 0;
                    rMot = 0;
                    if (curve < 0) {
                        lMot = 1 + curve * 2;
                        rMot = 1;
                    }
                    else if (curve > 0) {
                        lMot = 1;
                        rMot = 1 - curve * 2;
                    }
                    else {
                        lMot = 1;
                        rMot = 1;
                    }
                    exports.leftMotor.setSpeed(lMot * speed);
                    exports.rightMotor.setSpeed(rMot * speed);
                    hasTime = duration && duration.hasOwnProperty("time");
                    hasDistance = duration && duration.hasOwnProperty("distance");
                    if (!(duration && (hasTime || hasDistance))) return [3 /*break*/, 5];
                    if (!hasTime) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all([
                            exports.leftMotor.move(duration),
                            exports.rightMotor.move(duration)
                        ])];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!hasDistance) return [3 /*break*/, 4];
                    distance = duration.distance;
                    return [4 /*yield*/, Promise.all([
                            exports.leftMotor.move({ distance: distance * lMot }),
                            exports.rightMotor.move({ distance: distance * rMot })
                        ])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, Promise.all([
                        exports.leftMotor.move(),
                        exports.rightMotor.move()
                    ])];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Rotate the robot
 * @param angle in degrees (optional)
 */
function rotate(angle) {
    return __awaiter(this, void 0, void 0, function () {
        var arcLength, lMot, rMot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exports.leftMotor.setSpeed(speed);
                    exports.rightMotor.setSpeed(speed);
                    if (!!angle) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all([
                            exports.leftMotor.move(),
                            exports.rightMotor.move()
                        ])];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    arcLength = (Math.abs(angle) / 360) * Math.PI * robutekDiameter;
                    lMot = void 0;
                    rMot = void 0;
                    if (angle < 0) {
                        lMot = -arcLength;
                        rMot = arcLength;
                    }
                    else {
                        lMot = arcLength;
                        rMot = -arcLength;
                    }
                    return [4 /*yield*/, Promise.all([
                            exports.leftMotor.move({ distance: lMot }),
                            exports.rightMotor.move({ distance: rMot })
                        ])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Stop the robot
 * @param brake if true, the robot will brake, otherwise it will coast to a stop
 */
function stop(brake) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        exports.leftMotor.stop(brake),
                        exports.rightMotor.stop(brake)
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
