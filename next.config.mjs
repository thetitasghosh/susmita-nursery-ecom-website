/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pxxaepclcxlvsvwgkhfk.supabase.co',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
