// script.js
document.getElementById('re_upload').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            document.getElementById('re_width-input').value = img.naturalWidth;
            document.getElementById('re_height-input').value = img.naturalHeight;
            document.getElementById('re_thumbnail').src = img.src;
        }
    }
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('re_width-input').addEventListener('input', function() {
    updateSizeInput('width');
});

document.getElementById('re_height-input').addEventListener('input', function() {
    updateSizeInput('height');
});

document.getElementById('re_download-btn').addEventListener('click', function() {
    const imgSrc = document.getElementById('re_thumbnail').src;
    const img = new Image();
    img.src = imgSrc;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const width = parseInt(document.getElementById('re_width-input').value, 10);
        const height = parseInt(document.getElementById('re_height-input').value, 10);
        const compression = parseInt(document.getElementById('re_compression-input').value, 10);

        canvas.width = width;
        canvas.height = height;

        context.drawImage(img, 0, 0, width, height);

        const format = document.getElementById('re_format-select').value;
        let mimeType;

        switch (format) {
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'webp':
                mimeType = 'image/webp';
                break;	
            case 'png':
                mimeType = 'image/png';
                break;
            case 'tiff':
                mimeType = 'image/tiff';
                break;
            case 'bmp':
                mimeType = 'image/bmp';
                break;
            default:
                mimeType = 'image/png';
        }
        const link = document.createElement('a');
        link.href = canvas.toDataURL(mimeType,compression/100 || 0.85);
        link.download = `resized-image.${format}`;
        link.click();
    }
});

function updateSizeInput(dimension) {
    const widthInput = document.getElementById('re_width-input');
    const heightInput = document.getElementById('re_height-input');

    if (dimension === 'width' && widthInput.value) {
        const img = new Image();
        img.src = document.getElementById('re_thumbnail').src;
        img.onload = function() {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            heightInput.value = Math.round(widthInput.value * aspectRatio);
        }
    } else if (dimension === 'height' && heightInput.value) {
        const img = new Image();
        img.src = document.getElementById('re_thumbnail').src;
        img.onload = function() {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    }
}
