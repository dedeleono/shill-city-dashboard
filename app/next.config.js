/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack5: true,
  images: {
    domains: [
      'infura-ipfs.io',
      'arweave.net',
      'hydra-raffle.s3.amazonaws.com',
    ],
  },
}
