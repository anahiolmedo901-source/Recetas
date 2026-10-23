/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#19221c',
        sage: '#315543',
        'sage-light': '#e6eee7',
        cream: '#f7f3eb',
        sand: '#ede6da',
        peach: '#f5b58f',
        coral: '#df765d',
        amber: '#d6a14b',
        'soft-white': '#fffdf9',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(35, 52, 41, 0.09)',
        card: '0 12px 35px rgba(35, 52, 41, 0.08)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 20% 20%, rgba(245,181,143,.22), transparent 35%), radial-gradient(circle at 90% 80%, rgba(49,85,67,.14), transparent 32%)',
      },
    },
  },
  plugins: [],
};
