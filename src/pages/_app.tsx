import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import Layout from "../components/Layout/Layout";
import { RecoilRoot } from "recoil";
import Provider from "../components/Web3/Provider";
import { MoralisProvider } from "react-moralis";

const moralisConfig = {
  appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
  serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL,
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <MoralisProvider
          serverUrl={moralisConfig.serverUrl}
          appId={moralisConfig.appId}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MoralisProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
