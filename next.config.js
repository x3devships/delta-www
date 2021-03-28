const withFonts = require('next-fonts');
const withImages = require('next-images');

module.exports = withFonts(withImages({
  exportTrailingSlash: true,
  exportPathMap() {
    return {
      '/': { page: '/' },
      '/vaults': { page: '/vaults' },
      '/contracts': { page: '/contracts' },
    };
  }
}));