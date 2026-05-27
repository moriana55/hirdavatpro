import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.join(projectRoot, "node_modules"),
      "node_modules",
    ];
    return config;
  },
};

export default nextConfig;
