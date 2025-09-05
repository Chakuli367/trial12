import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // Replit-specific dev plugins
  if (mode !== "production" && process.env.REPL_ID) {
    import("@replit/vite-plugin-cartographer").then(({ cartographer }) => {
      plugins.push(cartographer());
    });
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"), // frontend root
    build: {
      outDir: path.resolve(__dirname, "client/dist"), // output folder
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "client/index.html"), // main HTML file
      },
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
