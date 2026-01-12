/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình Next.js
  reactStrictMode: true,

  // Cấu hình environment variables
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  }
}

module.exports = nextConfig
