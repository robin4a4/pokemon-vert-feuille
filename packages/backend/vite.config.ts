import { defineConfig, loadEnv } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig(({ mode }) => {
    console.log(mode)
    const env = loadEnv(mode, "./env");
    console.log(env)
    return {

    envDir: "./env",
    define: {
        "__SECRET_TOKEN__": JSON.stringify(env.VITE_SECRET_TOKEN),
    },
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/server.ts",
    }),
  ],
}});
