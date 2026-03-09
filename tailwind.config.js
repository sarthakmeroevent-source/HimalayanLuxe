import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#D4AF37",
                "primary-light": "#F1E5C3",
                "primary-dark": "#B8941F",
                emerald: {
                    DEFAULT: "#0F7A4D", // Richer jeweltone emerald
                    light: "#16B371",
                    dark: "#073D26",
                    deep: "#02160E", // Very deep, almost black
                },
                gold: {
                    DEFAULT: "#D4AF37",
                    muted: "#A68953",
                },
                "background-dark": "#010C08", // Almost black with green tint
                "background-light": "#f6f7f8"
            },
            fontFamily: {
                display: ["Dm Sans", "sans-serif"],
                serif: ["Playfair Display", "serif"],
                sans: ["Montserrat", "sans-serif"],
                manrope: ["Manrope", "sans-serif"],
                meno: ["meno-banner", "serif"],
                cursive: ["Pinyon Script", "cursive"]
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            }
        }
    },
    plugins: [
        containerQueries,
        forms
    ],
};
