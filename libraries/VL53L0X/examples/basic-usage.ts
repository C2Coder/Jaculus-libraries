import { I2C1 } from "i2c";
import { VL53L0X } from "./libs/VL53L0X.js"
import { stdout } from "stdio";

I2C1.setup({sda: 17, scl: 9, bitrate: 400000});
const vl = new VL53L0X(I2C1);

async function main() {
    while (true) {
        const m = await vl.read();
        console.log("Distance: " + m.distance + " mm  \tSignal: " + m.signalRate + "\tAmb: " + m.ambientRate + "\tSPAD: " + m.effectiveSpadRtnCount);
    }
}

main().catch(console.error);