import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next doesn't get confused by
  // stray lockfiles elsewhere on disk (e.g. in a parent directory).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
