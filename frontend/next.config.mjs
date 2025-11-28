/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  allowedDevOrigins: [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    '*.replit.dev',
    '*.janeway.replit.dev',
  ],
};

export default nextConfig;
