/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/git-green-squares',
    // assetPrefix: '/',
    images: {
      unoptimized: true,  // Required for static exports
    },
  };
  
  export default nextConfig;
  