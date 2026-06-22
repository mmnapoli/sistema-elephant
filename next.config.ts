import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Saída otimizada para Docker (server mínimo na VPS).
  output: "standalone",
};

export default nextConfig;
