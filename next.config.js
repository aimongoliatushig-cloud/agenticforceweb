
function supabaseHostname() {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
}

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'cdn.simpleicons.org',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
];

const supabaseHost = supabaseHostname();
if (supabaseHost) {
  remotePatterns.push({
    protocol: 'https',
    hostname: supabaseHost,
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add image optimization configuration
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns,
  },
  // Add compiler options for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

module.exports = nextConfig
