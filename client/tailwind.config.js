/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0fdff',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6', // Teal/Cyan Access
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                accent: {
                    DEFAULT: '#00E5FF', // Bright Cyan from image
                    glow: 'rgba(0, 229, 255, 0.5)'
                },
                canvas: {
                    DEFAULT: '#09090b', // Deepest background
                    alt: '#000000',
                },
                panel: {
                    DEFAULT: '#121214', // Card background
                    hover: '#1c1c1f',
                    border: '#27272a'
                },
                lavender: {
                    DEFAULT: '#C3B1E1',
                    brand: '#DCD0FF',
                    dark: '#9A8CBB'
                },
                dark: {
                    950: '#020202',
                    900: '#09090b',
                    800: '#121214',
                    700: '#18181b',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'premium-gradient': 'linear-gradient(135deg, #09090b 0%, #000000 100%)',
            }
        },
    },
    plugins: [],
}
