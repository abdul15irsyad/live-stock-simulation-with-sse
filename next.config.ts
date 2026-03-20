import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: false,
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/merge',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
