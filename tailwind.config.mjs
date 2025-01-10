import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dvs-orange": "#ff6600",
        "dvs-orange-light": "#ff8533",
        "dvs-gray-dark": "#4a4a4a",
        "dvs-gray": "#666666",
        "dvs-gray-light": "#f5f5f5",
      },
    },
  },
  plugins: [
    forms({
      strategy: "class",
    }),
  ],
};
