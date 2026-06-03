import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// elementPlus按需导入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
      dirs: ["src/components"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/element/index.scss" as *;
          @use "@/styles/var.scss" as *;
        `,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/vue") ||
            id.includes("node_modules/pinia") ||
            id.includes("node_modules/vue-router")
          ) {
            return "vendor-vue";
          }
          if (
            id.includes("node_modules/axios") ||
            id.includes("node_modules/@vueuse") ||
            id.includes("node_modules/dayjs")
          ) {
            return "vendor-libs";
          }
        },
      },
    },
  },
});
