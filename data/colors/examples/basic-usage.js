import { SmartLed, LED_WS2812 } from "smartled";
import * as colors from "./libs/colors.js";
const ledStrip = new SmartLed(48, 1, LED_WS2812);
// Set the first LED to red
ledStrip.set(0, colors.red);
ledStrip.show();
// Set custom HSL color
ledStrip.set(0, colors.hsl_to_rbg({ h: 0, s: 1, l: 0.5 }));
ledStrip.show();
// Set rainbow color
ledStrip.set(0, colors.rainbow(0));
ledStrip.show();
// Set rainbow color with custom brightness
ledStrip.set(0, colors.rainbow(0, 50));
ledStrip.show();
// Set off
ledStrip.set(0, colors.off);
ledStrip.show();
