/** @type {import('tailwindcss').Config} */
export const content = [
  // 1. Look for classes in your app's pages and components
  "./src/**/*.{js,jsx}",
  "./pages/**/*.{js,jsx}",
  "./components/**/*.{js,jsx}",

  // 2. Look for classes in the shared UI package
  "../../packages/ui/src/**/*.{js,jsx}",
];
export const theme = {
  extend: {},
};
export const plugins = [];
