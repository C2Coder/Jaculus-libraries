import * as adc from "adc";
import * as gpio from "gpio";
import * as motor from "motor";
import * as ledc from "ledc";
const robutekDiameter = 80; // mm
const wheelDiameter = 33.3; // mm
const wheelCircumference = Math.PI * wheelDiameter;
export var PenPos;
(function (PenPos) {
    PenPos[PenPos["Down"] = 562] = "Down";
    PenPos[PenPos["Up"] = 332] = "Up";
    PenPos[PenPos["Unload"] = 150] = "Unload";
})(PenPos || (PenPos = {}));
export var Pins;
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
})(Pins || (Pins = {}));
let sw = 0;
function switchSensors(toValue) {
    if (toValue == sw) {
        return;
    }
    sw = toValue;
    gpio.write(Pins.SensSW, toValue);
    // don't do this at home
    const start = Date.now();
    while (Date.now() - start < 2)
        ;
}
export function readSensor(sensor) {
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
const leftMotorPins = { motA: Pins.Motor1A, motB: Pins.Motor1B, encA: Pins.Enc1A, encB: Pins.Enc1B };
const rightMotorPins = { motA: Pins.Motor2A, motB: Pins.Motor2B, encA: Pins.Enc2A, encB: Pins.Enc2B };
const leftMotorLedc = { timer: 0, channelA: 0, channelB: 1 };
const rightMotorLedc = { timer: 0, channelA: 2, channelB: 3 };
export const leftMotor = new motor.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: 410, circumference: wheelCircumference });
export const rightMotor = new motor.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: 410, circumference: wheelCircumference });
adc.configure(Pins.Sens1, adc.Attenuation.Db0);
adc.configure(Pins.Sens2, adc.Attenuation.Db0);
adc.configure(Pins.Sens3, adc.Attenuation.Db0);
adc.configure(Pins.Sens4, adc.Attenuation.Db0);
gpio.pinMode(Pins.SensEN, gpio.PinMode.OUTPUT);
gpio.write(Pins.SensEN, 1);
gpio.pinMode(Pins.SensSW, gpio.PinMode.OUTPUT);
let speed = 0;
export function setSpeed(value) {
    speed = value;
}
export function getSpeed() {
    return speed;
}
/**
 * Move the robot
 * @param curve number in range -1 to 1, where -1 is full left, 0 is straight and 1 is full right
 * @param duration optional duration of the move
 */
export async function move(curve, duration) {
    let lMot = 0;
    let rMot = 0;
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
    leftMotor.setSpeed(lMot * speed);
    rightMotor.setSpeed(rMot * speed);
    const hasTime = duration && duration.hasOwnProperty("time");
    const hasDistance = duration && duration.hasOwnProperty("distance");
    if (duration && (hasTime || hasDistance)) {
        if (hasTime) {
            await Promise.all([
                leftMotor.move(duration),
                rightMotor.move(duration)
            ]);
        }
        else if (hasDistance) {
            const distance = duration.distance;
            await Promise.all([
                leftMotor.move({ distance: distance * lMot }),
                rightMotor.move({ distance: distance * rMot })
            ]);
        }
    }
    else {
        await Promise.all([
            leftMotor.move(),
            rightMotor.move()
        ]);
    }
}
/**
 * Rotate the robot
 * @param angle in degrees (optional)
 */
export async function rotate(angle) {
    leftMotor.setSpeed(speed);
    rightMotor.setSpeed(speed);
    if (!angle) {
        await Promise.all([
            leftMotor.move(),
            rightMotor.move()
        ]);
    }
    else {
        const arcLength = (Math.abs(angle) / 360) * Math.PI * robutekDiameter;
        let lMot;
        let rMot;
        if (angle < 0) {
            lMot = -arcLength;
            rMot = arcLength;
        }
        else {
            lMot = arcLength;
            rMot = -arcLength;
        }
        await Promise.all([
            leftMotor.move({ distance: lMot }),
            rightMotor.move({ distance: rMot })
        ]);
    }
}
/**
 * Stop the robot
 * @param brake if true, the robot will brake, otherwise it will coast to a stop
 */
export async function stop(brake) {
    await Promise.all([
        leftMotor.stop(brake),
        rightMotor.stop(brake)
    ]);
}
