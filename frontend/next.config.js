/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://accounts.google.com; frame-src 'self' https://accounts.google.com;"
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3645/api/:path*'
      }
    ]
  },
}

module.exports = nextConfig