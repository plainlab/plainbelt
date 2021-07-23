const typography = require('@tailwindcss/typography');

module.exports = {
  theme: {},
  purge: {
    content: ['./src/**/*.{ts,tsx,html}'],
  },
  variants: {},
  plugins: [typography],
};
