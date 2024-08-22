"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.off = exports.white = exports.pink = exports.purple = exports.blue = exports.light_blue = exports.green = exports.yellow = exports.orange = exports.red = void 0;
exports.hsl_to_rbg = hsl_to_rbg;
exports.rainbow = rainbow;
/**
 * Mezi jednotlivými reprezentacemi lze převádět
 * @param hsl {Number} Hue (0-360), Saturation (0-1), Lightness (0-1)
 * @returns {Rgb} Red (0-255), Green (0-255), Blue (0-255)
 */
function hsl_to_rbg(hsl) {
    var chroma = (1 - Math.abs(2 * hsl.l - 1) * hsl.s);
    var hue = hsl.h / 60;
    var x = chroma * (1 - Math.abs((hue % 2) - 1));
    var color = { r: 0, g: 0, b: 0 };
    if (hue > 0 && hue < 1) {
        color = { r: chroma, g: x, b: 0 };
    }
    else if (hue >= 1 && hue < 2) {
        color = { r: x, g: chroma, b: 0 };
    }
    else if (hue >= 2 && hue < 3) {
        color = { r: 0, g: chroma, b: x };
    }
    else if (hue >= 3 && hue < 4) {
        color = { r: 0, g: x, b: chroma };
    }
    else if (hue >= 4 && hue < 5) {
        color = { r: x, g: 0, b: chroma };
    }
    else {
        color = { r: chroma, g: 0, b: x };
    }
    var correction = hsl.l - chroma / 2;
    color.r = (color.r + correction) * 255;
    color.g = (color.g + correction) * 255;
    color.b = (color.b + correction) * 255;
    return color;
}
/**
 * Funkce rainbow zafixuje sytost a světlost, a prochází barvami
 * @param hue (0-360)
 * @param brightness (0-100) - 50 je defaultní hodnota
 * @returns {Rgb}
 */
function rainbow(hue, brightness) {
    if (brightness === void 0) { brightness = 50; }
    hue = Math.min(hue, 360); // Zajistíme, že zadaná hodnota není mimo rozsah
    // fix range to 0-100
    var brightness_mapped = Math.min(Math.max(brightness, 0), 100);
    return hsl_to_rbg({ h: hue, s: 1, l: brightness_mapped / 100 });
}
/* Základní barvy pro LED pásky*/
exports.red = rainbow(0);
exports.orange = rainbow(27);
exports.yellow = rainbow(54);
exports.green = rainbow(110);
exports.light_blue = rainbow(177);
exports.blue = rainbow(240);
exports.purple = rainbow(285);
exports.pink = rainbow(323);
exports.white = { r: 100, g: 100, b: 100 };
exports.off = { r: 0, g: 0, b: 0 };
