/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // tambahkan ini

  ],
  theme: {
    extend: {},
  },
  plugins: [
     require('flowbite/plugin')
  ],
}