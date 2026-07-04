/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      // Cykelmov-paletten, spejlet fra global.css (:root-variablerne).
      colors: {
        asfalt: '#141419',
        'asfalt-2': '#1e1e26',
        kridt: '#F5F3ED',
        'kridt-2': '#ECE8DE',
        cobalt: '#1D3EE3',
        'cobalt-dyb': '#142CB0',
        signal: '#FFD02F',
        hindbaer: '#E84F8A',
        creme: '#F7F0E6',
        graa: '#6d6d78',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Schibsted Grotesk"', 'sans-serif'],
        label: ['"Space Grotesk"', 'monospace'],
      },
      maxWidth: {
        wrap: '1240px',
      },
    },
  },
  plugins: [],
};
