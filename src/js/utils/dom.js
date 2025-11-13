//palette-pilot\src\js\utils\dom.js
// Элементы страницы
export const DOM = {
  loader: document.querySelector('.palette-download__loader'),
  imageLoaderButton: document.querySelector('#image-loader-input'),

  paletteDownload: document.querySelector('#palette-download'),
  palettePreviewBox: document.querySelector('#palette-preview'),
  paletteColorsBox: document.querySelector('#palette-colors'),
  contrastSandbox: document.querySelector('#contrast-sandbox'),
  utilityBox: document.querySelector('#utility-colors-container'),

  replaceImgBtn: document.querySelector('#replace-image-btn'),
  resetBtn: document.querySelector('#reset-state-btn'),
  regenerateBtn: document.querySelector('#regenerate-btn'),

  modeSelect: document.querySelector('#generation-mode-select'),
  formatSwitcher: document.querySelector('#format-switcher'),

  toastContainer: document.querySelector('#toast-container'),
  shareBtn: document.querySelector('#share-btn'),

  exportCssBtn: document.querySelector('#export-css-btn'),
  exportPanel: document.querySelector('#export-panel'),
  exportCodeContent: document.querySelector('#export-code-content'),
  exportPanelCloseBtn: document.querySelector('#export-panel-close-btn'),
  exportPanelCopyBtn: document.querySelector('#export-panel-copy-btn'),
  overlay: document.querySelector('#overlay'),
  exportPanelDownloadBtn: document.querySelector('#export-panel-download-btn'),
}

// Элементы песочницы контрастов
const sandboxAll = document.querySelectorAll('.drop-target');
export const sandbox = {};

sandboxAll.forEach(item => {
  const key = item.getAttribute('data-target-prop');
  sandbox[key] = item;
});

// Сравнение контраста для элементов
export const contrastPairs = {
  titleANDpage: ['pageBackground', 'headingColor'],
  boxANDtext: ['boxBackground', 'textColor'],
  buttonANDTextButton: ['buttonInsideBackground', 'buttonInsideTextColor'],
  buttonOutsideANDTexButtonOutside: ['buttonOutsideBackground', 'buttonOutsideTextColor'],
  headerANDlinkPrimary: ['headerBackground', 'linkColorPrime'],
  headerANDlinkSecondary: ['headerBackground', 'linkColor'],
  boxANDpage: ['boxBackground', 'pageBackground'],
  buttonOutsideANDPage: ['pageBackground', 'buttonOutsideBackground'],
  buttonANDBox: ['buttonInsideBackground', 'boxBackground']
};

// Бэйджи
export const badges = {
  titleANDpage: document.querySelector('#titleANDpage'),
  boxANDtext: document.querySelector('#boxANDtext'),
  buttonANDTextButton: document.querySelector('#buttonANDTextButton'),
  buttonOutsideANDTexButtonOutside: document.querySelector('#buttonOutsideANDTexButtonOutside'),
  headerANDlinkPrimary: document.querySelector('#headerANDlinkPrimary'),
  headerANDlinkSecondary: document.querySelector('#headerANDlinkSecondary'),
  boxANDpage: document.querySelector('#boxANDpage'),
  buttonOutsideANDPage: document.querySelector('#buttonOutsideANDPage'),
  buttonANDBox: document.querySelector('#buttonANDBox')
};

export function resetHTML(element) {
  element.innerHTML = '';
}

export function doVisible(element, isVisibled = true) {
  isVisibled ? element.classList.add('is-visibled') : element.classList.remove('is-visibled');
}