// share.js
import { getFinalTime } from './countdown.js';

export function sharePuzzle(shareUrl, shareText = 'I just solved the Stakco puzzle!') {
    const finalTime = getFinalTime();
    const shareData = {
        title: 'Stakco Daily Puzzle',
        text: `${shareText} Time: ${finalTime}`,
        url: shareUrl
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Successful share'))
            .catch(err => console.log('Error sharing:', err));
    } else {
        // fallback copy to clipboard
        const textarea = document.createElement('textarea');
        textarea.value = `${shareData.text} ${shareData.url}`;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert(`Copied to clipboard: ${shareData.text} ${shareData.url}`);
    }
}
