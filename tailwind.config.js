/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./public/**/*.{html,js}",  // Adjust according to your directory structure
      "./views/**/*.{html,js}",   // If you have a views folder
      "./uploads/**/*.{html,js}"  // If you want to include uploads (if needed)
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }