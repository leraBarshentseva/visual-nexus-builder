import './scss/style.scss';
import { state } from './js/modules/state.js';
import { loadStateFromLocalStorage, loadStateFromURL } from './js/modules/storage.js';

import { renderPalette, renderUtilityColors, updatePreviewImageUI } from './js/modules/ui.js';

import { loadImageFromDB } from './js/db.js';
import { initDragAndDrop } from './js/modules/dnd.js';
import { initEventHandlers } from './js/modules/handlers.js';
import {
  applySandboxStyles,
  updateFormatSwitcherUI
} from './js/modules/ui.js';


async function init() {
  const loadedFromURL = loadStateFromURL();
  if (!loadedFromURL) {
    loadStateFromLocalStorage();
  }

  const imageBlob = await loadImageFromDB();
  if (imageBlob) {
    state.previewImage = URL.createObjectURL(imageBlob);
  }

  updateFormatSwitcherUI();

  renderPalette();
  renderUtilityColors();
  applySandboxStyles(false);
  updatePreviewImageUI();

  initEventHandlers();
  initDragAndDrop();
}

init();