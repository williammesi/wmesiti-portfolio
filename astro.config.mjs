// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import icon from "astro-icon";

import react from "@astrojs/react";

import sanity from "@sanity/astro";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  // Removed webcore() since the package doesn't exist
  integrations: [
    vue(),
    icon(),
    react(),
    sanity({
      projectId: "9bdbnjzy",
      dataset: "production",
      // Set useCdn to false if you're building statically.
      useCdn: false,
      studioBasePath: "/admin",
    }),
  ],
  output: "server",
  adapter: vercel(),
});
