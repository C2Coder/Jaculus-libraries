"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servo = void 0;
var ledc = require("ledc");
/**
 * A class for controlling a servo motor.
 */
var Servo = /** @class */ (function () {
    /**
     * Create a new servo object.
     * @param pin The pin the servo is connected to.
     * @param timer The timer to use for PWM.
     * @param channel The channel to use for PWM.
     */
    function Servo(pin, timer, channel) {
        this.channel = channel;
        ledc.configureTimer(timer, 50, 12); // 50Hz is the frequency of a servo, 12 is the resolution of the timer
        ledc.configureChannel(channel, pin, timer, 1023); // 1023 is the resolution of a servo
    }
    /**
     * Set the servo position.
     * @param value The position to set the servo to, from 0-1023.
     */
    Servo.prototype.write = function (value) {
        // map the value from 0-1023 to 0.5-2.5ms
        var ms = ((value / 1023) * 2) + 0.5; // 0.5-2.5ms is the range of a servo
        // convert to a duty cycle
        var duty = (ms / 20) * 1023; // 20ms is the period of a servo
        ledc.setDuty(this.channel, duty); // set the duty cycle to the servo
    };
    return Servo;
}());
exports.Servo = Servo;
