//palette-pilot\src\js\modules\handlers.js
import { colorCountGenerate, WCAG_AA_CONTRAST_RATIO } from '../utils/constants.js';
import { DOM, sandbox, contrastPairs, badges, resetHTML } from '../utils/dom.js';
import {
    rgbToHex,
    arrayToRgbString,
    rgbStringToArray,
    getContrastTextColor,
    getContrastRatio,
    findColorIndex,
    rgbToHSLString,
} from '../utils/colors.js';
import { state } from './state.js';

import { generateCssVariables } from '../app.js'


export function renderPalette() {
    const container = DOM.paletteColorsBox;
    container.innerHTML = '';

    if (state.palette.length === 0) {
        for (let i = 0; i < colorCountGenerate; i++) {
            const placeholder = createPlaceholderElement();
            container.append(placeholder);
        }
    } else {
        state.palette.forEach((color, index) => {

            if (state.loadingColorIndexes.includes(index)) {
                const loadingBox = createLoadingElement();
                container.append(loadingBox);
            } else {
                const colorBox = createElementColorBox(color);
                colorBox.dataset.colorIndex = index;
                container.append(colorBox);
            }
        });

        updateLockedColorUI();
        updateBaseColorUI(state.baseColor);
    }
}

export function renderUtilityColors() {
    const container = DOM.utilityBox;
    if (!container) return;
    container.innerHTML = '';

    state.utilityColors.forEach(color => {
        const colorBox = createUtilityColorBox(color);
        container.append(colorBox);
    })
}

export function createUtilityColorBox(color) {
    const rgbColor = `rgb(${color.join(', ')})`;
    const divColor = document.createElement('div');

    divColor.style.backgroundColor = rgbColor;
    divColor.classList.add('palette-colors__item', 'palette-colors__item--utility');
    divColor.draggable = "true";

    const hexCode = document.createElement('span');
    hexCode.classList.add('palette-colors__hex');
    hexCode.title = "Нажмите, чтобы скопировать hex-код цвета";
    hexCode.textContent = rgbToHex(color[0], color[1], color[2]);
    hexCode.style.color = getContrastTextColor(color);
    divColor.append(hexCode);
    return divColor;
}


export function createLoadingElement() {
    const div = document.createElement('div');
    div.classList.add('palette-colors__item', 'is-loading');
    div.draggable = false;
    return div;
}

export function updateLockedColorUI() {
    document.querySelectorAll('.palette-colors__item').forEach(item => {
        if (!item.style.backgroundColor) return;

        const colorArray = rgbStringToArray(item.style.backgroundColor);
        const isLocked = findColorIndex(state.lockedColors, colorArray) > -1;
        const lockElement = item.querySelector('.palette-colors__lock');

        if (lockElement) {
            if (isLocked) {
                lockElement.classList.add('palette-colors__lock--locked');
            } else {
                lockElement.classList.remove('palette-colors__lock--locked');
            }
        }

    });
}

export function createPlaceholderElement() {
    const div = document.createElement('div');
    div.classList.add('palette-colors__item', 'is-empty');

    div.draggable = false;

    return div;
}

export function createElementColorBox(color) {
    const rgbColor = `rgb(${color.join(', ')})`;

    const divColor = document.createElement('div');

    divColor.style.backgroundColor = rgbColor;
    divColor.classList.add('palette-colors__item');
    divColor.draggable = "true";

    const lockBloc = document.createElement('span');
    lockBloc.classList.add('palette-colors__lock');
    lockBloc.title = "Fix the color";

    const lockColor = getContrastTextColor(color);
    lockBloc.style.setProperty('--lock-color', lockColor);

    const hexCode = document.createElement('span');
    hexCode.classList.add('palette-colors__hex');
    hexCode.title = "click to copy the color hex code";

    const [r, g, b] = color;

    let colorString = '';

    switch (state.displayFormat) {
        case 'RGB':
            colorString = arrayToRgbString(color);
            break;
        case 'HSL':
            colorString = rgbToHSLString(r, g, b);
            break;
        case 'HEX':
        default:
            colorString = rgbToHex(r, g, b);
            break;
    }

    hexCode.textContent = colorString;

    let colorText = getContrastTextColor(color);
    hexCode.style.color = colorText;

    const baseLabel = document.createElement('span');
    baseLabel.classList.add('palette-colors__base-label');
    baseLabel.textContent = 'base color';

    divColor.append(lockBloc);
    divColor.append(hexCode);
    divColor.append(baseLabel);

    return divColor;
}

export function updateBaseColorUI(newBaseColorArray) {
    const currentBase = document.querySelector('.palette-colors__item--base');
    if (currentBase) {
        currentBase.classList.remove('palette-colors__item--base');
    }

    if (newBaseColorArray) {
        const newBaseRgbString = arrayToRgbString(newBaseColorArray);
        document.querySelectorAll('.palette-colors__item').forEach(item => {
            if (item.style.backgroundColor === newBaseRgbString) {
                item.classList.add('palette-colors__item--base');
            }
        });
    }
}

export function updateBadge(badgeElement, ratio) {

    const isOk = ratio >= WCAG_AA_CONTRAST_RATIO;

    badgeElement.textContent = `${ratio.toFixed(2)}:1`;
    badgeElement.style.backgroundColor = isOk ? '#28a745' : '#721c24';
    badgeElement.classList.add('is-visible');
}


export function updatePreviewImageUI() {
    if (state.previewImage) {
        const wrapper = document.querySelector('.palette-preview__image-wrapper');
        if (!wrapper) return;
        resetHTML(wrapper);

        const imgElement = createPreviewImageElement();
        imgElement.src = state.previewImage;

        wrapper.append(imgElement);

        switchUploaderView('preview');
    }
}

export function createPreviewImageElement() {
    
    let imgElement = document.createElement('img');
    imgElement.crossOrigin = "anonymous";
    imgElement.alt = "Preview of the uploaded image";
    imgElement.classList.add('palette-preview__image');

    return imgElement;
}

export function switchUploaderView(viewToShow = '') {
    if (viewToShow === 'preview') {
        DOM.paletteDownload.classList.remove('is-active');
        DOM.palettePreviewBox.classList.add('is-active');
    } else {
        DOM.paletteDownload.classList.add('is-active');
        DOM.palettePreviewBox.classList.remove('is-active');
    }
}

export function applySandboxStyles(calculateContrast = true) {
    Object.keys(state.sandbox).forEach(prop => {
        const el = sandbox[prop];
        const value = state.sandbox[prop];

        if (!el || !value) return;

        const cssValue = arrayToRgbString(value);
        if (prop.toLowerCase().includes('color')) {
            el.style.color = cssValue;
        } else {
            el.style.backgroundColor = cssValue;
        }
    });
    if (calculateContrast) {
        calculateAndShowResults();
    }
}

function calculateAndShowResults() {

    Object.entries(contrastPairs).forEach(([name, [bgKey, fgKey]]) => {
        const bg = state.sandbox[bgKey];
        const fg = state.sandbox[fgKey];

        if (!bg || !fg) return;

        const ratio = getContrastRatio(bg, fg);
        const badgeEl = badges[name];

        if (badgeEl) updateBadge(badgeEl, ratio);

    });
}

export function showToast(message, type = 'info', duration = 4000) {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add(`toast`, `toast--${type}`);
    toast.textContent = message;

    DOM.toastContainer.append(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, { once: true });
    }, duration);
}

export function openExportPanel() {
    if (state.palette.length === 0) {
        showToast("Palette is empty. Nothing to export.", "error");
        return;
    }

    const cssCode = generateCssVariables(state.palette);
    DOM.exportCodeContent.textContent = cssCode;

    DOM.exportPanel.classList.add('is-active');
    DOM.overlay.classList.add('is-active');
}

export function closeExportPanel() {
    DOM.exportPanel.classList.remove('is-active');
    DOM.overlay.classList.remove('is-active');
}

export function updateFormatSwitcherUI() {
    const selector = `input[name="color-format"][value="${state.displayFormat}"]`;
    const selectedInput = document.querySelector(selector);

    if (selectedInput) {
        selectedInput.checked = true;
    }
}