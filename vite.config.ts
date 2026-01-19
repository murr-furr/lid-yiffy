import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import viteCompression from "vite-plugin-compression";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    target: "es2015",
    cssMinify: "lightningcss",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        babelrc: true,
        configFile: true,
      },
      apply: "build", // Only apply during build to avoid conflict with dev server HMR/SSR
    }),
    tsconfigPaths(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
    viteCompression(), // Default is gzip
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }), // Add Brotli
  ],
});
