import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import Layout from "../components/Layout/Layout";
import { RecoilRoot } from "recoil";
import Provider from "../components/Web3/Provider";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <MoralisProvider
          serverUrl={process.env.MORALIS_SERVER_URL}
          appId={process.env.MORALIS_APP_ID}
        >
          <Layout>
            <Provider />
            <Component {...pageProps} />
          </Layout>
        </MoralisProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
