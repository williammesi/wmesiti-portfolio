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
  // Site configuration
  site: "https://wmesiti-portfolio.vercel.app",
  base: "/",

  // Build optimizations
  build: {
    // Inline stylesheets smaller than 4kb
    inlineStylesheets: "auto",
  },

  // Vite configuration for performance
  vite: {
    plugins: [tailwindcss()],
    build: {
      // CSS code splitting for better performance
      cssCodeSplit: true,
      // Rollup optimizations
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor libraries
            "vendor-react": ["react", "react-dom"],
            "vendor-vue": ["vue"],
            "vendor-sanity": ["@sanity/client", "@sanity/astro"],
            "vendor-ui": ["@material-tailwind/react", "styled-components"],
            // Utils and smaller libraries
            utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          },
          // Optimize chunk file names
          chunkFileNames: "assets/chunks/[name]-[hash].js",
          entryFileNames: "assets/entry/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
      // Minification options
      minify: "esbuild",
      // Target modern browsers for smaller bundles
      target: "es2020",
      // Source map configuration
      sourcemap: false, // Disable in production for smaller builds
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "vue",
        "@sanity/client",
        "clsx",
        "tailwind-merge",
        "web-vitals",
      ],
    },
    // Server configuration for development
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: [".."],
      },
    },
  },

  // Integrations with optimized configuration
  integrations: [
    vue(),
    icon({
      // Icon optimizations
      iconDir: "src/assets/icons",
      include: {
        // Only include icons we actually use
        mdi: [
          "github",
          "linkedin",
          "open-in-new",
          "chevron-left",
          "chevron-right",
          "alert-circle",
          "check-circle",
          "email",
          "phone",
          "school",
        ],
        ep: ["right", "bottom"],
      },
    }),
    react({
      // React optimizations
      include: ["**/react/*"],
    }),
    sanity({
      projectId: "9bdbnjzy",
      dataset: "production",
      // Use CDN in production for better performance
      useCdn: true,
      studioBasePath: "/admin",
      // Optimize GROQ queries
      apiVersion: "2023-01-01",
    }),
  ],

  // Server-side rendering configuration
  output: "server",
  adapter: vercel({
    // Vercel adapter optimizations
    includeFiles: ["./src/lib/**/*"],
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
    isr: {
      // Incremental Static Regeneration for better performance
      expiration: 60 * 60 * 24, // 24 hours
    },
  }),

  // Image optimization
  image: {
    domains: ["cdn.sanity.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  // Security headers
  security: {
    checkOrigin: true,
  },

  // Prefetch configuration
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  // Markdown configuration (if using markdown)
  markdown: {
    // Optimize markdown processing
    shikiConfig: {
      // Use a smaller syntax highlighting theme
      theme: "github-dark",
    },
  },

  // Experimental features for performance
  experimental: {
    // Optimize client hydration
    clientPrerender: true,
  },
});
