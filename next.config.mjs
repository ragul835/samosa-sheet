/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep a background dev server isolated from production builds.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  logging: {
    // Browser extensions can reject promises in their injected page scripts.
    // Keep those third-party failures out of the Next.js server process; genuine
    // application errors remain visible in the browser console and error overlay.
    browserToTerminal: false
  },
  experimental: {
    // The CLI type-check path can truncate `tsc --showConfig` output on Node 24.
    // Use the compiler API; `npm run lint` still runs the complete CLI check.
    useTypeScriptCli: false,
    // Keep static generation reliable in memory-constrained build containers.
    cpus: 1
  }
};

export default nextConfig;
