/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* chrome-extension:",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: https: http:",
                  "font-src 'self' data:",
                  "connect-src 'self' https: http: ws: wss:",
                  "frame-src 'self'",
                ].join('; ')
              : [
                  "default-src 'self'",
                  "script-src 'self'",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: https:",
                  "font-src 'self' data:",
                  "connect-src 'self' https:",
                  "frame-src 'self'",
                ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

