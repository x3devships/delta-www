const withFonts = require('next-fonts');
const withImages = require('next-images');
const nextTranslate = require('next-translate');

module.exports = withFonts(withImages(nextTranslate()));
