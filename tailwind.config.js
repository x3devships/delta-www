const windmill = require('@windmill/react-ui/config');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = windmill({
  purge: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: true,
  theme: {
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
      greenText: '#4DA560'
    },
    extend: {
      fontFamily: {
        wulkan: ['WulkanDisplay, sans-serif'],
        gt_americare: ['gt_americaregular']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
});
