/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC, use Babel instead
  compiler: {
    removeConsole: false,
  },
  // Allow 0.0.0.0 binding for network access
  // No additional config needed, already in package.json
}

module.exports = nextConfig
