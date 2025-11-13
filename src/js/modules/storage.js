//palette-pilot\src\js\modules\storage.js
import {
    rgbToHex,
    hexToRgbArray,
} from '../utils/colors.js';
import { state } from './state.js';

export function saveStateToLocalStorage() {
    localStorage.setItem('palette-pilot-palette', JSON.stringify(state.palette));
    localStorage.setItem('palette-pilot-locked', JSON.stringify(state.lockedColors));
    localStorage.setItem('palette-pilot-base-color', JSON.stringify(state.baseColor));
    localStorage.setItem('palette-pilot-sandbox', JSON.stringify(state.sandbox));
    localStorage.setItem('palette-pilot-displayFormat', JSON.stringify(state.displayFormat));
}

export function loadStateFromLocalStorage() {
    const savedPalette = JSON.parse(localStorage.getItem('palette-pilot-palette'));
    const savedLockedColors = JSON.parse(localStorage.getItem('palette-pilot-locked'));
    const savedBaseColor = JSON.parse(localStorage.getItem('palette-pilot-base-color'));
    const savedSandbox = JSON.parse(localStorage.getItem('palette-pilot-sandbox'));
    const savedDisplayFormat = JSON.parse(localStorage.getItem('palette-pilot-displayFormat'));

    if (savedPalette) {
        state.palette = savedPalette;
    }
    if (savedLockedColors) {
        state.lockedColors = savedLockedColors;
    }
    if (savedBaseColor) {
        state.baseColor = savedBaseColor;
    }
    if (savedSandbox) {
        state.sandbox = savedSandbox;
    }
    if (savedDisplayFormat) {
        state.displayFormat = savedDisplayFormat;
    }
}

export function clearLocalStorage() {
    localStorage.removeItem('palette-pilot-palette');
    localStorage.removeItem('palette-pilot-locked');
    localStorage.removeItem('palette-pilot-base-color');
    localStorage.removeItem('palette-pilot-sandbox');
    localStorage.removeItem('palette-pilot-displayFormat');
}

export function resetState() {
    state.palette = [];
    state.lockedColors = [];
    state.baseColor = null;
    state.previewImage = null;
    state.displayFormat = 'HEX',
        state.sandbox = {
            boxBackground: [255, 255, 255],
            buttonInsideBackground: [255, 255, 255],
            buttonInsideTextColor: [0, 0, 0],
            buttonOutsideBackground: [255, 255, 255],
            buttonOutsideTextColor: [0, 0, 0],
            headerBackground: [255, 255, 255],
            headingColor: [0, 0, 0],
            linkColor: [0, 0, 0],
            linkColorPrime: [0, 0, 0],
            pageBackground: [255, 255, 255],
            textColor: [0, 0, 0],
        };
}

export function saveStateToURL() {
    const params = new URLSearchParams();

    if (state.palette.length > 0) {
        const paletteEncode = encondePaletteForUrl(state.palette);
        params.append('palette', paletteEncode);
    }
    if (state.lockedColors.length > 0) {
        const lockedColorsEncode = encondePaletteForUrl(state.lockedColors);
        params.append('locked', lockedColorsEncode);
    }
    if (state.baseColor) {
        const baseColorEncoded = rgbToHex(state.baseColor[0], state.baseColor[1], state.baseColor[2]).slice(1);
        params.append('baseColor', baseColorEncoded);
    }
    if (state.displayFormat) {
        params.append('displayFormat', state.displayFormat);
    }

    const sandboxParams = new URLSearchParams(encodeSandboxForURL(state.sandbox));
    sandboxParams.forEach((value, key) => {
        params.append(key, value);
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState(null, '', newUrl);
}

export function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);

    const paletteFromURL = params.get('palette');
    const lockedFromURL = params.get('locked');
    const baseColorFromURL = params.get('baseColor');
    const displayFormatFromURL = params.get('displayFormat');

    if (paletteFromURL) {
        const decodedPalette = decodePaletteFromURL(paletteFromURL);
        if (decodedPalette && decodedPalette.length > 0) {
            state.palette = decodedPalette;

            if (lockedFromURL) {
                state.lockedColors = decodePaletteFromURL(lockedFromURL);
            }

            if (baseColorFromURL) {
                state.baseColor = hexToRgbArray(baseColorFromURL);
            }

            if (displayFormatFromURL) {
                state.displayFormat = displayFormatFromURL;
            }

            state.sandbox = decodeSandboxFromURL(params);
            state.previewImage = null;

            return true;
        }
    }
    return false;
}

export function resetStateFromURL() {
    history.pushState(null, '', window.location.pathname);
}

export function encondePaletteForUrl(paletteArray) {
    if (paletteArray.length === 0 || !Array.isArray(paletteArray)) return "";

    return paletteArray.map(color => rgbToHex(color[0], color[1], color[2]).slice(1)).join('-');
}

export function encodeSandboxForURL(sandboxObject) {
    const params = new URLSearchParams();
    for (const key in sandboxObject) {
        const color = sandboxObject[key];
        if (color) {
            params.append(key, rgbToHex(color[0], color[1], color[2]).slice(1));
        }
    }
    return params.toString();
}

function decodeSandboxFromURL(params) {
    const sandboxState = {};
    for (const key in state.sandbox) {
        if (params.has(key)) {
            const hex = params.get(key);
            sandboxState[key] = hexToRgbArray(hex);
        }
    }
    return sandboxState;
}

function decodePaletteFromURL(paletteString) {

    if (!paletteString) {
        return [];
    }

    return paletteString
        .split('-')
        .filter(hex => hex)
        .map(hex => hexToRgbArray(hex));
}