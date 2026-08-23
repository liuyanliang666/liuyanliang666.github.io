import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

// Set NEXT_PUBLIC_BASE_PATH to "/<repo-name>" when deploying to a project page
// (e.g. github.com/you/portfolio -> "/portfolio"). Leave it unset for a user
// page repo named <username>.github.io.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages, which has no Node server.
  output: "export",
  basePath,
  // GitHub Pages serves /about as /about/index.html, so emit trailing slashes.
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    // next/image optimization needs a server; serve the originals instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
