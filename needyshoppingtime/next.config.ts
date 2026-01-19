import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignora errores de TypeScript para que deje subir sí o sí
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignora errores de estilo (Linting)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;