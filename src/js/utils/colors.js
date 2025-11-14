//palette-pilot\src\js\utils\colors.js

export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgbArray(hexString) {

    let hex = hexString.replace("#", "");

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    if (hex.length !== 6) {
        return null;
    }

    const triplets = hex.match(/.{2}/g);
    if (!triplets) return null;

    const [r, g, b] = triplets.map(x => parseInt(x, 16));
    return [r, g, b];
}

export function arrayToRgbString(colorArray) {
    if (!colorArray) return '';
    return `rgb(${colorArray.join(', ')})`
}

export function rgbStringToArray(rgbString) {
    return rgbString.match(/\d+/g).map(Number);
}

export function getContrastTextColor(colorArray) {
    const [r, g, b] = colorArray;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
}

export function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const lightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (lightest + 0.05) / (darkest + 0.05);
}

function getLuminance(rgb) {
    const [r, g, b] = rgb.map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function findColorIndex(array, colorToFind) {
    return array.findIndex(c => c[0] === colorToFind[0] && c[1] === colorToFind[1] && c[2] === colorToFind[2]);
}

export function rgbToHSLString(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}