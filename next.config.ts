/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    domains: ["openweathermap.org"],
  },
};

module.exports = nextConfig;
