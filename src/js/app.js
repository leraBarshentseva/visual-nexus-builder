import { API_COLOR_URL, colorCountGenerate } from './utils/constants.js';
import {
    rgbToHex,
    findColorIndex
} from './utils/colors.js';

import { state } from './modules/state.js';
import {
    saveStateToLocalStorage,
    encondePaletteForUrl,
    encodeSandboxForURL
} from './modules/storage.js';

import {
    renderPalette,
    switchUploaderView,
    showToast
} from './modules/ui.js';

import { saveImageToDB } from './db.js';

import { resetHTML, doVisible, DOM } from './utils/dom.js';

import { modeGeneration } from './utils/constants.js';

export async function regeneratePalette() {
    if (state.baseColor === null) {
        showToast('Please select a base color first by clicking on a locked color.', 'error');
        return;
    }

    const unlockedIndexes = [];
    state.palette.forEach((color, index) => {
        const isLocked = findColorIndex(state.lockedColors, color) > -1;
        if (!isLocked) {
            unlockedIndexes.push(index);
        }
    });

    if (unlockedIndexes.length === 0) {
        alert('Все цвета закреплены. Нечего регенерировать.');
        return;
    }

    state.loadingColorIndexes = unlockedIndexes;
    renderPalette();

    const baseColorArray = state.baseColor;
    const hexWithHash = rgbToHex(baseColorArray[0], baseColorArray[1], baseColorArray[2]);
    const hexForApi = hexWithHash.slice(1);
    const countToGenerate = unlockedIndexes.length;

    const mode = modeGeneration;
    const selectedMode = DOM.modeSelect.value;

    const url = new URL(API_COLOR_URL);
    url.searchParams.append('hex', hexForApi);
    url.searchParams.append('mode', selectedMode);
    url.searchParams.append('count', countToGenerate);

    const dataColorsPalette = await getColorsPaletteAPI(url);

    if (dataColorsPalette === null || !dataColorsPalette.colors) {
        showToast('Could not generate palette. Please try again later.', 'error');
        return;
    }

    const newColors = dataColorsPalette.colors.map(color => [color.rgb.r, color.rgb.g, color.rgb.b]);

    unlockedIndexes.forEach((paletteIndex, i) => {
        if (newColors[i]) {
            state.palette[paletteIndex] = newColors[i];
        }
    });

    state.loadingColorIndexes = [];

    renderPalette();
    saveStateToLocalStorage();

    doVisible(DOM.loader, false);
}

export async function getColorsPaletteAPI(url) {

    if (url === '') return null;
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const dataColors = await response.json();
        return dataColors;

    } catch (error) {
        console.error('Возникла ошибка во время запроса:', error);
        return null;
    }
}

export function addFilePreview(files) {

    const result = validateFile(files);

    if (!result.isValidated) {
        return;
    }

    const file = result.file;
    saveImageToDB(file);

    const imageUrl = URL.createObjectURL(file);
    const wrapper = document.querySelector('.palette-preview__image-wrapper');
    if (!wrapper) return;
    resetHTML(wrapper);

    const imgElement = document.createElement('img');
    imgElement.crossOrigin = "anonymous";
    imgElement.alt = "Предпросмотр загруженного изображения";
    imgElement.classList.add('palette-preview__image');

    imgElement.addEventListener('load', function () {
        const colorThief = new window.ColorThief();
        const mainColor = colorThief.getColor(imgElement);
        const paletteFromThief = colorThief.getPalette(imgElement, colorCountGenerate);

        const uniquePalette = paletteFromThief.filter(color => {
            return findColorIndex([mainColor], color) === -1;
        });

        state.previewImage = imageUrl;

        state.palette = [mainColor, ...uniquePalette];
        state.palette = state.palette.slice(0, colorCountGenerate);

        state.lockedColors = [];
        state.baseColor = null;

        renderPalette();
        saveStateToLocalStorage();

        doVisible(DOM.loader, false);
        switchUploaderView('preview');
    });

    imgElement.src = imageUrl;
    wrapper.append(imgElement)

}

export function handlePaletteSort(draggedIndex, targetIndex) {
    const [draggedItem] = state.palette.splice(draggedIndex, 1);
    state.palette.splice(targetIndex, 0, draggedItem);
    renderPalette();
    saveStateToLocalStorage();
}

function validateFile(files) {
    if (files.length === 0) {
        return { isValidated: false, message: 'Файл не выбран', file: null };
    }

    const file = files[0];

    if (!file.type.startsWith('image/')) {
        return { isValidated: false, message: 'Выбранный файл не является изображением', file: null };
    }

    return { isValidated: true, message: 'Файл корректен', file: file };
}

export function generateCssVariables(paletteArray) {
    if (!Array.isArray(paletteArray) || paletteArray.length === 0) {
        return ":root {\n  /* No colors to export. */\n}";
    }

    const variables = paletteArray
        .map((color, index) => {
            const hex = rgbToHex(color[0], color[1], color[2]);
            return `  --color-primary-${index + 1}: ${hex};`;
        })
        .join('\n');

    return `:root {\n${variables}\n}`;
}

export function downloadTextAsFile(filename, text) {
    const element = document.createElement('a');

    const file = new Blob([text], { type: 'text/css' });

    element.href = URL.createObjectURL(file);
    element.download = filename;

    element.click();

    URL.revokeObjectURL(element.href);
}

export function generateShareableURL() {
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

    const shareableURL = `${location.origin}${window.location.pathname}?${params.toString()}`;
    return shareableURL;
}