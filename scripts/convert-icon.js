const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '../assets/logo.svg');
const outputPath = path.join(__dirname, '../assets/logo-icon.png');

sharp(inputPath)
    .resize(1024, 1024) // Resize to standard icon size
    .png()
    .toFile(outputPath)
    .then(info => {
        console.log('Icon created successfully:', info);
    })
    .catch(err => {
        console.error('Error creating icon:', err);
        process.exit(1);
    });
