/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/git-green-squares',
    images: {
      unoptimized: true,  // Required for static exports
    },
  };
  
  export default nextConfig;
  