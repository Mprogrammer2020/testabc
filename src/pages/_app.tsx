import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { handleOauthRedirect } from "@/cubistWallet/oauth";
import React from "react";

void handleOauthRedirect();

export default function App({ Component, pageProps }: AppProps) {
  return (
        <Component {...pageProps} />
  );
}