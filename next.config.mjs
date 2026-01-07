/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to finish even if you have red TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;