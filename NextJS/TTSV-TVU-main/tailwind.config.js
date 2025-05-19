/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // theme section is generally not needed for custom colors in v4
    // theme: {
    //     extend: {
    // Colors are defined as CSS variables in globals.css
    // fontFamily can still be extended if needed
    // fontFamily: {
    //     sans: ['var(--font-geist-sans)'],
    //     mono: ['var(--font-geist-mono)'],
    // },
    //     },
    // },
    plugins: [],
};
