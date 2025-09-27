// images.js
import { checkImageExists } from './utils.js';

export function generateImageUrls(config, customPuzzle, totalLayers, dateStr) {
    const urls = { primary: {}, backup: {} };

    if (customPuzzle) {
        for (let i = 1; i <= totalLayers; i++) {
            urls.primary[`layer${i}`] =
                `${config.BASE_IMAGE_URL}/${customPuzzle.username}/${customPuzzle.puzzleIdFull}/${customPuzzle.puzzleId}_${i-1}.png`;
        }
        for (let i = 1; i <= 3; i++) {
            urls.backup[`layer${i}`] =
                `${config.BASE_IMAGE_URL}/${config.DEFAULT_USER_ID}/latest/${config.DEFAULT_PUZZLE_ID}/${config.DEFAULT_PUZZLE_ID.split('_')[0]}_${i-1}.png`;
        }
    } else {
        for (let i = 1; i <= totalLayers; i++) {
            const imageIndex = i - 1;
            urls.primary[`layer${i}`] =
                `${config.BASE_IMAGE_URL}/${config.DEFAULT_USER_ID}/${dateStr}/${config.DEFAULT_PUZZLE_ID}/${config.DEFAULT_PUZZLE_ID.split('_')[0]}_${imageIndex}.png`;
            urls.backup[`layer${i}`] =
                `${config.BASE_IMAGE_URL}/${config.DEFAULT_USER_ID}/latest/${config.DEFAULT_PUZZLE_ID}/${config.DEFAULT_PUZZLE_ID.split('_')[0]}_${imageIndex}.png`;
        }
    }

    return urls;
}

export async function loadImages(container, puzzleLayers, imageUrls) {
    let loadedCount = 0;
    for (let i = 1; i <= Object.keys(puzzleLayers).length; i++) {
        const layerKey = `layer${i}`;
        const layerElement = document.getElementById(layerKey);
        if (!layerElement) continue;

        try {
            const primaryUrl = imageUrls.primary[layerKey];
            const exists = await checkImageExists(primaryUrl);
            if (exists) {
                layerElement.style.backgroundImage = `url('${primaryUrl}')`;
            } else {
                const backupUrl = imageUrls.backup[layerKey];
                if (backupUrl) layerElement.style.backgroundImage = `url('${backupUrl}')`;
            }
            loadedCount++;
        } catch (err) {
            const backupUrl = imageUrls.backup[layerKey];
            if (backupUrl) layerElement.style.backgroundImage = `url('${backupUrl}')`;
            loadedCount++;
        }
    }
    return loadedCount;
}
