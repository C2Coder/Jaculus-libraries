import { open as kvOpen } from "keyvalue";
const ADDRESS_LOW = 66;
const ADDRESS_HIGH = 67;
var Reg;
(function (Reg) {
    Reg[Reg["Command"] = 128] = "Command";
    Reg[Reg["DeviceId"] = 130] = "DeviceId";
    Reg[Reg["RevisionId"] = 131] = "RevisionId";
    Reg[Reg["RedChan"] = 160] = "RedChan";
    Reg[Reg["GreenChan"] = 162] = "GreenChan";
    Reg[Reg["BlueChan"] = 164] = "BlueChan";
    Reg[Reg["ClearChan"] = 166] = "ClearChan";
    Reg[Reg["IRChan"] = 168] = "IRChan";
})(Reg || (Reg = {}));
var CmdMask;
(function (CmdMask) {
    CmdMask[CmdMask["PON"] = 1] = "PON";
    CmdMask[CmdMask["RGB_EN"] = 2] = "RGB_EN";
    CmdMask[CmdMask["W_EN"] = 4] = "W_EN";
    // reserved
    CmdMask[CmdMask["DARK_EN"] = 16] = "DARK_EN";
    // reserved
    CmdMask[CmdMask["RGB_TIME"] = 1792] = "RGB_TIME";
    CmdMask[CmdMask["W_TIME"] = 2048] = "W_TIME";
    CmdMask[CmdMask["AGAIN"] = 12288] = "AGAIN";
    CmdMask[CmdMask["IRGAIN"] = 49152] = "IRGAIN";
})(CmdMask || (CmdMask = {}));
function setMasked(bus, address, reg, quantity, mask, value) {
    let data = bus.writeRead(address, reg, quantity);
    for (let i = 0; i < quantity; i++) {
        let maskByte = (mask >> (8 * i)) & 0xff;
        let valueByte = (value >> (8 * i)) & 0xff;
        data[i] = (data[i] & ~maskByte) | (valueByte & maskByte);
    }
    bus.writeTo(address, [reg, ...data]);
}
function readInt16(bus, address, reg) {
    let value = bus.writeRead(address, reg, 2);
    return value[0] | (value[1] << 8);
}
function scale(value, min, max) {
    const val = (value - min) / (max - min);
    return Math.min(Math.max(val, 0), 1);
}
export class ZSCS2016C {
    /**
     * Creates a new instance of the ZSCS2016C color sensor.
     * @param bus The I2C bus used for communication
     * @param addrBit If true, uses address 0x43, otherwise 0x42
     */
    constructor(bus, addrBit) {
        this.cal = {
            mins: Array(5).fill(0),
            maxs: Array(5).fill(1),
        };
        this.bus = bus;
        this.addr = addrBit ? ADDRESS_HIGH : ADDRESS_LOW;
    }
    /**
     * Resets the sensor to its default state.
     */
    reset() {
        setMasked(this.bus, this.addr, Reg.Command, 2, 0xffff, 0);
    }
    /**
     * Initializes the sensor
     */
    enable() {
        setMasked(this.bus, this.addr, Reg.Command, 2, 0xffff, CmdMask.PON | CmdMask.RGB_EN);
    }
    /**
     * Reads value of the red channel and applies calibration.
     * @returns Scaled value of the red channel (0-1)
     */
    readRed() {
        let value = this.readRawRed();
        return scale(value, this.cal.mins[0], this.cal.maxs[0]);
    }
    /**
     * Reads value of the green channel and applies calibration.
     * @returns Scaled value of the green channel (0-1)
     */
    readGreen() {
        let value = this.readRawGreen();
        return scale(value, this.cal.mins[1], this.cal.maxs[1]);
    }
    /**
     * Reads value of the blue channel and applies calibration.
     * @returns Scaled value of the blue channel (0-1)
     */
    readBlue() {
        let value = this.readRawBlue();
        return scale(value, this.cal.mins[2], this.cal.maxs[2]);
    }
    /**
     * Reads value of the IR channel and applies calibration.
     * @returns Scaled value of the IR channel (0-1)
     */
    readIR() {
        let value = this.readRawIR();
        return scale(value, this.cal.mins[3], this.cal.maxs[3]);
    }
    /**
     * Reads value of the clear channel (unfiltered color) and applies calibration.
     * @returns Scaled value of the clear channel (0-1)
     */
    readClear() {
        let value = this.readRawClear();
        return scale(value, this.cal.mins[4], this.cal.maxs[4]);
    }
    /**
     * Reads values of all RGB channels and applies calibration.
     * @note This method is more efficient and accurate than reading all channels individually.
     * @returns Array of scaled RGB values [R, G, B] (0-1)
     */
    readRGB() {
        let value = this.readRawRGB();
        return [
            scale(value[0], this.cal.mins[0], this.cal.maxs[0]),
            scale(value[1], this.cal.mins[1], this.cal.maxs[1]),
            scale(value[2], this.cal.mins[2], this.cal.maxs[2]),
        ];
    }
    /**
     * Reads raw value of the red channel.
     * @returns Raw value of the red channel
     */
    readRawRed() {
        return readInt16(this.bus, this.addr, Reg.RedChan);
    }
    /**
     * Reads raw value of the green channel.
     * @returns Raw value of the green channel
     */
    readRawGreen() {
        return readInt16(this.bus, this.addr, Reg.GreenChan);
    }
    /**
     * Reads raw value of the blue channel.
     * @returns Raw value of the blue channel
     */
    readRawBlue() {
        return readInt16(this.bus, this.addr, Reg.BlueChan);
    }
    /**
     * Reads raw value of the IR channel.
     * @returns Raw value of the IR channel
     */
    readRawIR() {
        return readInt16(this.bus, this.addr, Reg.IRChan);
    }
    /**
     * Reads raw value of the clear channel (unfiltered color).
     * @returns Raw value of the clear channel
     */
    readRawClear() {
        return readInt16(this.bus, this.addr, Reg.ClearChan);
    }
    /**
     * Reads raw values of all RGB channels.
     * @note This method is more efficient and accurate than reading all channels individually.
     * @returns Array of raw RGB values [R, G, B]
     */
    readRawRGB() {
        let value = this.bus.writeRead(this.addr, Reg.RedChan, 6);
        return [
            value[0] | (value[1] << 8),
            value[2] | (value[3] << 8),
            value[4] | (value[5] << 8),
        ];
    }
    /**
     * Runs a calibration procedure for the sensor. During the calibration, the sensor
     * should be placed on a white and a black surface. The resulting calibration
     * depends on the distance from the surface and lighting conditions.
     */
    async runCalibration() {
        let mins = Array(5).fill(Infinity);
        let maxs = Array(5).fill(0);
        let funs = ["readRawRed", "readRawGreen", "readRawBlue", "readRawIR", "readRawClear"];
        console.log("Place on white...");
        await sleep(3000);
        console.log("measuring...");
        for (let i = 0; i < 30; i++) {
            for (let i = 0; i < funs.length; i++) {
                let value = this[funs[i]]();
                maxs[i] = Math.max(maxs[i], value);
            }
            await sleep(10);
        }
        console.log("Place on black...");
        await sleep(3000);
        console.log("measuring...");
        for (let i = 0; i < 30; i++) {
            for (let i = 0; i < funs.length; i++) {
                let value = this[funs[i]]();
                mins[i] = Math.min(mins[i], value);
            }
            await sleep(10);
        }
        console.log("Calibration done");
        this.cal = {
            mins: mins,
            maxs: maxs,
        };
    }
    /**
     * Returns the current calibration data.
     * @throws Error if calibration is not set
     * @returns The current calibration data
     */
    getCalibration() {
        if (!this.cal) {
            throw new Error("Calibration not set");
        }
        return this.cal;
    }
    /**
     * Sets the calibration data.
     * @param cal The calibration data to set
     */
    setCalibration(cal) {
        this.cal = cal;
    }
    /**
     * Saves the current calibration data to persistent storage.
     * @param id Identifier for the calibration data
     */
    saveCalibration(id) {
        const kv = kvOpen("ZSCS2016C_calib");
        kv.set(id, JSON.stringify(this.cal));
        kv.commit();
    }
    /**
     * Loads calibration data from persistent storage.
     * @param id Identifier for the calibration data
     */
    loadCalibration(id) {
        const kv = kvOpen("ZSCS2016C_calib");
        const data = kv.getString(id);
        if (!data) {
            throw new Error(`Calibration with id ${id} not found`);
        }
        this.cal = JSON.parse(data);
    }
}
