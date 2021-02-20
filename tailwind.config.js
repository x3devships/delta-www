const windmill = require('@windmill/react-ui/config');

module.exports = windmill({
  purge: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: true,
  theme: {
    fontFamily: {
      wulkan: ['Wulkan Display'],
      gt_america: ['GT America'],
      sans: ['GT America', 'sans-serif'],
      serif: ['GT America', 'serif'],
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }

      sm: { max: '639px' }
      // => @media (max-width: 639px) { ... }
    },
    minWidth: {
      '0': '0',
      '1/5': '14.1%',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gradiantBlue: '#4315C7',
      gradiantPurple: '#CBC4E0',
      gradiantGreen: '#4CA560',
      gradiantLightGreen: '#DBF0E0',
      backgroundLightPurple: '#EDEAF4',
      backgroundPage: '#E5E5E5',
      backgroundButton: '#C7C7C7',
      greenText: '#4DA560',
      backgroundWebsite: '#ebebeb'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
});
