import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling native Node.js modules.
  // Required for bcryptjs and Prisma to work correctly on Vercel/Render.
  serverExternalPackages: ["bcryptjs", "@prisma/client", "prisma"],

  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;

