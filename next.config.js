/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removes double rerender https://github.com/vercel/next.js/issues/35822
  // Which is happening only in dev mode.
  reactStrictMode: false,
}

module.exports = nextConfig
