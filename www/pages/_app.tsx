import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/globals.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-800 w-screen h-screen text-white">
      <Head>
        <title>p2p.chat</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default App;
