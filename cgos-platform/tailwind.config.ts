import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kesh: "#00a651",
        "kesh-green": "#00a651",
        "kesh-dark": "#008540",
      },
    },
  },
  plugins: [],
}

export default config