import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  reactStrictMode: true,
  swcMinify: true,
};

export default bundleAnalyzer(config);
