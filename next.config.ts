import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Parent lockfiles (e.g. C:\Users\Destiny\package-lock.json) can make Next.js
  // pick the wrong workspace root, which breaks dev manifests and page resolution.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
