const windmill = require('@windmill/react-ui/config');

module.exports = windmill({
  purge: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      wulkan: ['Wulkan Display'],
      gt_america: ['GT America'],
      sans: ['GT America', 'sans-serif'],
      serif: ['GT America', 'serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gradiantBlue: '#4315C7',
      gradiantPurple: '#CBC4E0',
      gradientPink: '#DB77EB',
      gradientPink2: '#DBC9D6',
      gradiantGreen: '#4CA560',
      gradiantLightGreen: '#DBF0E0',
      backgroundLightPurple: '#EDEAF4',
      backgroundPage: '#E5E5E5',
      backgroundButton: '#C7C7C7',
      greenText: '#4DA560'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
});
