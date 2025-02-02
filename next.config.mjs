// next.config.js
/** @type {import('next').NextConfig} */

import webpack from "webpack";

const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      })
    );
    return config;
  },
  images: {
    domains: ["res.cloudinary.com", "wallpapercave.com","lh3.googleusercontent.com","profile.line-scdn.net"],
  },
};

export default nextConfig;