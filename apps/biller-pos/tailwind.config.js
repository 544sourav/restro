/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 1. Path to your app's files
    "./src/**/*.{js,jsx}",

    // 2. Path to your shared UI package
    "../../packages/ui/src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
