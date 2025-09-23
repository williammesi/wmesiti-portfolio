// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import icon from "astro-icon";

import react from "@astrojs/react";

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    vue(),
    icon(),
    react(),
    sanity({
      projectId: "wmesiti-portfolio-cms",
      dataset: "wmesiti-portfolio-data",
      // Set useCdn to false if you're building statically.
      useCdn: false,
    }),
  ],
  // Removed webcore() since the package doesn't exist
});
