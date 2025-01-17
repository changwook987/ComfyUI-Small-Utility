import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts"],
      name: "SmallUtility",
      formats: ["iife"],
      fileName(format, entryName) {
        return `bundle.js`;
      },
    },
    rollupOptions: {
      external: ["@comfyorg/comfyui-frontend-types", "@comfyorg/litegraph"],
      output: {
        dir: "web",
        globals: {
          "@comfyorg/litegraph": "LiteGraph",
        },
      },
    },
  },
});
