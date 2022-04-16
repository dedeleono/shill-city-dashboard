import "../styles/globals.css";
import React from 'react';
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
const WalletProviderSection = dynamic(
  () => import("../components/shared/ConnectionProvider"),
  {
    ssr: false,
  }
);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <>
          <Head>
              <title>Shill City: Sea Shanties</title>
              <meta
                  name="description"
                  content="Welcome to Shill City the DeFi metaverse of Sea Shanties"
              />
              <link rel="icon" href="/favicon.ico" />
              <meta name="og:title" content="Shill City: Sea Shanties" />
              <meta name="og:description" content="Welcome to Shill City the DeFi metaverse of Sea Shanties" />
              <meta name="og:image" content="TODO" />
              <meta name="twitter:image" content="TODO" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="@SeaShantiesSol" />
              <meta name="twitter:creator" content="@SeaShantiesSol" />
          </Head>
          <WalletProviderSection>
              <Component {...pageProps} />
          </WalletProviderSection>
      </>
  );
}
