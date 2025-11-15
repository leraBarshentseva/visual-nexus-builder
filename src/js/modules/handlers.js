//palette-pilot\src\js\modules\handlers.js

import { DOM, resetHTML, doVisible } from '../utils/dom.js';
import {
    rgbStringToArray,
    findColorIndex
} from '../utils/colors.js';
import { state } from './state.js';
import {
    saveStateToLocalStorage,
    clearLocalStorage,
    resetState,
    resetStateFromURL
} from './storage.js';

import {
    renderPalette,
    renderUtilityColors,
    updateBaseColorUI,
    switchUploaderView,
    applySandboxStyles,
    showToast,
    openExportPanel,
    closeExportPanel,
    activatePaintMode,
    deactivatePaintMode
} from './ui.js';
import { isMobile } from '../utils/constants.js';
import { deleteImageFromDB } from '../db.js';
import { regeneratePalette, addFilePreview, downloadTextAsFile, generateShareableURL, resetSandbox } from '../app.js';


export function initEventHandlers() {

    const onPaletteClick = (event) => {
        const clickedElement = event.target;
        const parentColorItem = clickedElement.closest('.palette-colors__item');
        if (!parentColorItem) return;

        const colorArray = rgbStringToArray(parentColorItem.style.backgroundColor);

        if (clickedElement.classList.contains("palette-colors__hex")) {
            const hexToCopy = clickedElement.textContent;
            navigator.clipboard.writeText(hexToCopy);
            showToast(`'${hexToCopy}' copied to clipboard!`, 'success');
            return;

        } else if (clickedElement.classList.contains("palette-colors__lock")) {
            const colorIndex = findColorIndex(state.lockedColors, colorArray);
            const isLocked = colorIndex > -1;

            if (isLocked) {
                state.lockedColors.splice(colorIndex, 1);

                const wasBaseColor = findColorIndex([state.baseColor], colorArray) > -1;
                if (wasBaseColor) {
                    state.baseColor = state.lockedColors.length > 0 ? state.lockedColors[0] : null;
                }

            } else {
                state.lockedColors.push(colorArray);

                if (state.lockedColors.length === 1) {
                    state.baseColor = colorArray;
                }
            }

            clickedElement.classList.toggle('palette-colors__lock--locked');
            updateBaseColorUI(state.baseColor);
            if (clickedElement.classList.contains('palette-colors__lock--locked')) {
                clickedElement.title = "Открепить цвет";
                saveStateToLocalStorage();
            } else {
                clickedElement.title = "Закрепить цвет";
                saveStateToLocalStorage();
            }
            return;

        } else if (parentColorItem.querySelector('.palette-colors__lock--locked')) {
            if (findColorIndex([state.baseColor], colorArray) === -1) {
                state.baseColor = colorArray;
                updateBaseColorUI(state.baseColor);
            }
        }

        if (isMobile) {
            activatePaintMode(clickedElement.style.backgroundColor);
        }
    };

    DOM.paletteColorsBox.addEventListener('click', onPaletteClick);
    DOM.utilityBox.addEventListener('click', onPaletteClick);
    DOM.resetSandboxBtn.addEventListener('click', resetSandbox);
    DOM.exportCssBtn.addEventListener('click', openExportPanel);
    DOM.exportPanelCloseBtn.addEventListener('click', closeExportPanel);
    DOM.overlay.addEventListener('click', closeExportPanel);

    DOM.exportPanelCopyBtn.addEventListener('click', () => {
        const codeToCopy = DOM.exportCodeContent.textContent;
        navigator.clipboard.writeText(codeToCopy);
        showToast('CSS variables copied!', 'success');
    });

    DOM.exportPanelDownloadBtn.addEventListener('click', () => {
        const codeToDownload = DOM.exportCodeContent.textContent;
        downloadTextAsFile('visual-nexus-builder.css', codeToDownload);
        showToast('Downloading palette-pilot.css...', 'success');
    });

    DOM.formatSwitcher.addEventListener('change', (event) => {
        state.displayFormat = event.target.value;
        renderPalette();
        renderUtilityColors();
        saveStateToLocalStorage();
    });

    DOM.resetBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to reset everything? This cannot be undone.')) {
            resetState();
            clearLocalStorage();
            resetStateFromURL();
            deleteImageFromDB();
            renderPalette();
            applySandboxStyles(false);
            switchUploaderView();
            const wrapper = document.querySelector('.palette-preview__image-wrapper');
            if (wrapper) resetHTML(wrapper);
        }
    });

    DOM.imageLoaderButton.addEventListener('change', function (event) {
        event.preventDefault();
        doVisible(DOM.loader);
        setTimeout(() => {
            const files = event.target.files;
            addFilePreview(files);
        }, 1000);
        renderPalette();
    });

    DOM.replaceImgBtn.addEventListener('click', function (e) {
        e.preventDefault();
        switchUploaderView();
        state.palette = [];
        renderPalette();
    });

    DOM.regenerateBtn.addEventListener('click', function (e) {
        e.preventDefault();
        regeneratePalette();
    });

    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
            e.preventDefault();
            regeneratePalette();
        }
    });

    DOM.shareBtn.addEventListener('click', () => {
        if (state.palette.length === 0) {
            showToast("Create a palette first to share it!", "error");
            return;
        }
        const shareURL = generateShareableURL();
        navigator.clipboard.writeText(shareURL);
        showToast("Link to share copied to clipboard!", "success");
    });

    if (isMobile) {
        const handleSandboxClick = (event) => {
            if (!state.activeColor) return;

            const dropZone = event.target.closest('.drop-target');
            if (!dropZone) return;

            event.preventDefault();

            const prop = dropZone.dataset.targetProp;
            const colorArray = rgbStringToArray(state.activeColor);
            state.sandbox[prop] = colorArray;
            applySandboxStyles(true);
            saveStateToLocalStorage();
            deactivatePaintMode();
        }

        DOM.contrastSandbox.addEventListener('click', handleSandboxClick);
        DOM.paintBrushReset.addEventListener('click', deactivatePaintMode);
    }
}
