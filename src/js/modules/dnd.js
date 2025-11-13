//palette-pilot\src\js\modules\dnd.js
import { DOM, doVisible } from '../utils/dom.js';
import {
    rgbStringToArray,
} from '../utils/colors.js';
import { state } from './state.js';
import {
    saveStateToLocalStorage,
} from './storage.js';

import {
    renderPalette,
    createPlaceholderElement,
    applySandboxStyles
} from './ui.js';

import {addFilePreview, handlePaletteSort} from '../app.js'

let draggedElement = null; //перетаскиваемый элемент
let placeholder = null; // "призрачный" блок

export function initDragAndDrop() {
    // Drag-and-drop изображения
    DOM.paletteDownload.addEventListener('dragenter', function (event) {
        event.preventDefault();
    });

    DOM.paletteDownload.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    DOM.paletteDownload.addEventListener('dragleave', function (event) {
        event.preventDefault();
    });

    DOM.paletteDownload.addEventListener('drop', function (event) {
        event.preventDefault();
        doVisible(DOM.loader);

        const files = event.dataTransfer.files;
        addFilePreview(files);
        renderPalette();
    });

    //Drag And Drop цветовой палитры на песочницу
    DOM.paletteColorsBox.addEventListener('dragstart', function (event) {

        const target = event.target;
        if (!target.classList.contains('palette-colors__item') || target.classList.contains('is-empty')) {
            event.preventDefault();
            return;
        }
        draggedElement = target;

        const draggedIndex = target.dataset.colorIndex;
        const draggedColor = target.style.backgroundColor;

        const dragData = {
            color: draggedColor,
            index: draggedIndex,
        };
        const dataString = JSON.stringify(dragData);

        event.dataTransfer.setData('application/json', dataString);

        setTimeout(() => {
            target.classList.add('palette-colors__item--dragging');
            target.classList.add('drag-hide');
        }, 0);

    });

    DOM.paletteColorsBox.addEventListener('dragover', function (e) {
        if (!draggedElement) {
            return;
        } 
        
        e.preventDefault();

        const currentOverElement = e.target.closest('.palette-colors__item:not([data-placeholder="true"])');
        if (!currentOverElement || currentOverElement === draggedElement) return;

        if (!placeholder) {
            placeholder = createPlaceholderElement();
            placeholder.dataset.placeholder = 'true';
        }

        const rect = currentOverElement.getBoundingClientRect();
        const isBefore = e.clientX < rect.left + rect.width / 2;

        const referenceNode = isBefore ? currentOverElement : currentOverElement.nextSibling;

        if (placeholder.nextSibling !== referenceNode) {
            currentOverElement.parentNode.insertBefore(placeholder, referenceNode);
        }
    });

    DOM.paletteColorsBox.addEventListener('dragend', function (event) {
        const divDragged = event.target;
        if (divDragged.classList.contains('palette-colors__item')) {
            divDragged.classList.remove('palette-colors__item--dragging');
        }

        if (draggedElement) {
            draggedElement.classList.remove('drag-hide');
            draggedElement = null;
        }

        const existingPlaceholder = document.querySelector('[data-placeholder="true"]');
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        placeholder = null;

    });

    DOM.paletteColorsBox.addEventListener('drop', function (event) {
        event.preventDefault();

        const dropTarget = event.target.closest('.palette-colors__item');
        if (!dropTarget) return;

        const dataString = event.dataTransfer.getData('application/json');
        if (!dataString) return;
        const dragData = JSON.parse(dataString);

        const draggedIndex = parseInt(dragData.index, 10);

        const placeholderNode = DOM.paletteColorsBox.querySelector('[data-placeholder="true"]');
        if (!placeholderNode) {
            return;
        }

        const allItems = Array.from(DOM.paletteColorsBox.children);
        let targetIndex = allItems.indexOf(placeholderNode);

        if (draggedIndex < targetIndex) {
            targetIndex--;
        }

        placeholderNode.remove();
        placeholder = null;

        if (draggedIndex === targetIndex) {
            return;
        }

        handlePaletteSort(draggedIndex, targetIndex);
    });

    DOM.utilityBox.addEventListener('dragstart', function (event) {
        draggedElement = null;

        const target = event.target;
        if (!target.classList.contains('palette-colors__item')) {
            return;
        }

        const draggedColor = target.style.backgroundColor;
        const dragData = {
            color: draggedColor,
            index: null,
        }
        event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    });

    DOM.contrastSandbox.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    DOM.contrastSandbox.addEventListener('drop', function (event) {
        event.preventDefault();

        const dataString = event.dataTransfer.getData('application/json');
        if (!dataString) return;

        const dragData = JSON.parse(dataString);
        const draggedColor = dragData.color;
        if (!draggedColor) return;

        const dropZone = event.target;
        const target = dropZone.closest('[data-target-prop]');
        if (!target) return;

        const prop = target.dataset.targetProp;
        const colorArray = rgbStringToArray(draggedColor);

        state.sandbox[prop] = colorArray;

        applySandboxStyles();
        saveStateToLocalStorage();
    });
}