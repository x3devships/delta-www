const withFonts = require('next-fonts');
const withImages = require('next-images');

module.exports = withFonts(withImages({
  trailingSlash: true,
  exportPathMap() {
    return {
      '/': { page: '/' },
      '/vault': { page: '/vault' },
      '/contracts': { page: '/contracts' },
      '/faq': { page: '/faq' },
    };
  }
}));