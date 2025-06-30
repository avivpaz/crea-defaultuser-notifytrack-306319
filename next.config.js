const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['tsconfig-paths'],
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // This allows the app to import modules from the src directory
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    // Add direct path aliases for all the problematic imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib/db': path.resolve('./app/lib/db.ts'),
      '@/lib/shippoUtils': path.resolve('./app/lib/shippoUtils.ts'),
      '@/lib/supabase': path.resolve('./app/lib/supabase.ts'),
      '@/services/paypal.service': path.resolve('./app/_services/paypal.service.ts')
    };
    return config;
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    REGION: 'us-east-1',
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    CARRIER: process.env.CARRIER || 'shippo'
  }
};

module.exports = nextConfig; 