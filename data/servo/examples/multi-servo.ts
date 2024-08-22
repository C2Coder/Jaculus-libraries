import { Servo } from "./libs/servo.js"

const SERVO_PIN = 35;
const TIMER = 1;
const CHANNEL_1 = 3;
const CHANNEL_2 = 4;

const servo_1 = new Servo(SERVO_PIN, TIMER, CHANNEL_1);
const servo_2 = new Servo(SERVO_PIN, TIMER, CHANNEL_2);

servo_1.write(0);    // 0°
servo_2.write(0);    // 0°

servo_1.write(512);  // 90°
servo_2.write(512);  // 90°

servo_1.write(1023); // 180°
servo_2.write(1023); // 180°