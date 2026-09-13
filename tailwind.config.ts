import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1C1A17",
        flannel: "#2A2723",
        seam: "#3A362F",
        bone: "#E8DFC8",
        faded: "#A69E8A",
        olive: "#7A7F4E",
        "olive-deep": "#5F6339",
        rust: "#A5552E",
        cream: "#EFE7D3",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      maxWidth: {
        page: "1320px",
        prose: "62ch",
      },
      letterSpacing: {
        sign: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
