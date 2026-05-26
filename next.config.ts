import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cấp IP để chạy trên điện thoại
  allowedDevOrigins: ['192.168.1.*'],
  /* config options here */
  transpilePackages: ["antd", "@ant-design/icons"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },  
        
};

export default nextConfig;
