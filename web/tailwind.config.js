const { borderRadius } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        brand:{
          300: '#996DFF',
          500:'#8b5cf6',

        }
      },
      borderRadius:{
        md:'4px',
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
  ],
}
