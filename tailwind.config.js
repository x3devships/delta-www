const windmill = require('@windmill/react-ui/config');

module.exports = windmill({
  purge: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: true,
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
});
