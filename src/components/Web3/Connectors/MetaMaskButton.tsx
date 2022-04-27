import { Button } from "@chakra-ui/react";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { ethers } from "ethers";
import { signInWithCustomToken } from "firebase/auth";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { desiredChainIdState } from "../../../atoms/desiredChainIdAtom";
import { getAddChainParameters } from "../../../chains";
import { hooks } from "../../../connectors/metaMask";
import { auth } from "../../../firebase/clientApp";
import Provider from "../../Web3/Provider";

type MetaMaskButtonProps = {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network;
};

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({ connector }) => {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const desiredChainId = useRecoilValue(desiredChainIdState);

  const onClick = () => {
    try {
      (async () => {
        // Check if metamask is installed and connect to desiredChainId
        if (!window.ethereum)
          throw new Error("No crypto wallet found. Please install it.");
        isActivating
          ? undefined
          : (async () => {
              connector instanceof WalletConnect || connector instanceof Network
                ? await connector.activate(desiredChainId.id)
                : await connector.activate(
                    getAddChainParameters(desiredChainId.id) as number
                  );
            })();
      })();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Button onClick={onClick} disabled={isActivating}>
      Connect Wallet
    </Button>
  );
};
export default MetaMaskButton;
