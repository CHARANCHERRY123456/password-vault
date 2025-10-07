// tailwind.config.ts
import { Config } from 'tailwindcss'
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
export default config