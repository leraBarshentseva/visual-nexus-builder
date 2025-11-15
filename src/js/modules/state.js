//palette-pilot\src\js\modules\state.js

export let state = {
    palette: [], // Generated palette (array of arrays [r, g, b])
    lockedColors: [], // "Frozen colors" (array of arrays [r, g, b])
    baseColor: null,
    previewImage: null,
    displayFormat: 'HEX',
    activeColor: null,
    loadingColorIndexes: [], //An array of indexes that are currently being loaded
    utilityColors: [
        [0, 0, 0],
        [248, 249, 250],
        [52, 58, 64],
        [255, 255, 255],
    ],
    sandbox: {
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
    }
};