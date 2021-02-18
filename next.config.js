const withImages = require("next-images");

module.exports = withImages({
  images: {
    // TODO: insert delta domain website here to avoid image optimization abuse.
    // https://nextjs.org/docs/basic-features/image-optimization
    domains: []
  },


   exportPathMap: async function(
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
      ) {
        return {
          "/": { page: "/" },

        };
      }
});
