/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://www.youtube.com https://youtube.com;",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://www.youtube.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;