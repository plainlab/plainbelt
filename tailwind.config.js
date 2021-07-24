const typography = require('@tailwindcss/typography');

module.exports = {
  theme: {},
  purge: {
    content: ['./src/**/*.{ts,tsx,html}'],
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active'],
      opacity: ['disabled'],
    },
  },
  plugins: [typography],
};
