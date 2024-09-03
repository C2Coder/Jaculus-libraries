import { Servo } from "./libs/servo.js";
const SERVO_PIN = 35;
const TIMER = 1;
const CHANNEL = 3;
const servo = new Servo(SERVO_PIN, TIMER, CHANNEL);
servo.write(0); // 0°
servo.write(512); // 90°
servo.write(1023); // 180°
