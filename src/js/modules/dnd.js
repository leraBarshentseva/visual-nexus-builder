//palette-pilot\src\js\modules\dnd.js
import Sortable from 'sortablejs';
import { isMobile } from '../utils/constants.js';
import { DOM, doVisible, toggleDragOver } from '../utils/dom.js';
import { rgbStringToArray } from '../utils/colors.js';
import { state } from './state.js';
import { saveStateToLocalStorage } from './storage.js';
import { applySandboxStyles } from './ui.js';
import { addFilePreview, handlePaletteSort } from '../app.js'

export function initDragAndDrop() {

    new Sortable(DOM.paletteColorsBox, {
        animation: 150,
        ghostClass: 'is-empty',
        handle: '.palette-colors__handle',
        onStart: () => DOM.paletteColorsBox.classList.add('dragging'),
        onEnd: (evt) => {
            DOM.paletteColorsBox.classList.remove('dragging');
            if (evt.oldIndex !== evt.newIndex) {
                handlePaletteSort(evt.oldIndex, evt.newIndex);
            }
        }
    });

    if (!isMobile) {
        const onDragStart = (event) => {

            const target = event.target.closest('.palette-colors__item');
            if (!target || target.classList.contains('is-empty')) return;

            event.dataTransfer.setData('text/plain', target.style.backgroundColor);
            event.dataTransfer.effectAllowed = 'copy';
        };

        DOM.paletteColorsBox.addEventListener('dragstart', onDragStart);
        DOM.utilityBox.addEventListener('dragstart', onDragStart);

        DOM.contrastSandbox.addEventListener('dragover', (e) => e.preventDefault());
        DOM.contrastSandbox.addEventListener('drop', (e) => {
            e.preventDefault();
            const colorString = e.dataTransfer.getData('text/plain');
            if (!colorString) return;

            const dropZone = e.target.closest('.drop-target');
            if (!dropZone) return;

            const prop = dropZone.dataset.targetProp;
            if (!prop) return;

            const colorArray = rgbStringToArray(colorString);
            if (!colorArray) return;

            state.sandbox[prop] = colorArray;
            applySandboxStyles(true);
            saveStateToLocalStorage();
            saveStateToURL();
        });
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        DOM.paletteDownload.addEventListener(eventName, (event) => {
            event.preventDefault();
            toggleDragOver(DOM.paletteDownload, true);
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        DOM.paletteDownload.addEventListener(eventName, (event) => {
            toggleDragOver(DOM.paletteDownload, false);
        });
    });

    DOM.paletteDownload.addEventListener('drop', (event) => {
        event.preventDefault();
        doVisible(DOM.loader, true);

        const files = event.dataTransfer.files;
        addFilePreview(files);
    });
}