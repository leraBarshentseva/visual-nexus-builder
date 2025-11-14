//palette-pilot\src\js\modules\dnd.js
import Sortable from 'sortablejs';

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
        onEnd: (evt) => {
            if (evt.oldIndex !== evt.newIndex) {
                handlePaletteSort(evt.oldIndex, evt.newIndex);
            }
        }
    });

    let draggedColor = null; //brush with paint

    const onPointerDown = (event) => {
        const target = event.target.closest('.palette-colors__item');
        if (!target || target.classList.contains('is-empty')) return;

        draggedColor = target.style.backgroundColor;

        if (event.type === 'dragstart') {
            event.dataTransfer.setData('text/plain', draggedColor);
            event.dataTransfer.effectAllowed = 'copy';
        }
    };

    const onPointerUp = () => {
        draggedColor = null;
    };

    DOM.paletteColorsBox.addEventListener('dragstart', onPointerDown);
    DOM.utilityBox.addEventListener('dragstart', onPointerDown);

    DOM.paletteColorsBox.addEventListener('touchstart', onPointerDown, { passive: true });
    DOM.utilityBox.addEventListener('touchstart', onPointerDown, { passive: true });

    const onDropInSandbox = (event, clientX, clientY) => {
        if (!draggedColor) return;
        event.preventDefault();

        const dropZone = document.elementFromPoint(clientX, clientY).closest('.drop-target');
        if (!dropZone || !dropZone.closest('#contrast-sandbox')) return;

        const prop = dropZone.dataset.targetProp;
        if (!prop) return;

        const colorArray = rgbStringToArray(draggedColor);
        if (!colorArray) return;

        state.sandbox[prop] = colorArray;
        applySandboxStyles(true);
        saveStateToLocalStorage();
    };

    DOM.contrastSandbox.addEventListener('dragover', e => e.preventDefault());
    DOM.contrastSandbox.addEventListener('drop', e => onDropInSandbox(e, e.clientX, e.clientY));

    document.addEventListener('touchend', e => onDropInSandbox(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY));

    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('dragend', onPointerUp);

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