import { Button } from "@chakra-ui/react";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import React from "react";
import { useRecoilValue } from "recoil";
import { desiredChainIdState } from "../../../atoms/desiredChainIdAtom";
import { getAddChainParameters } from "../../../chains";
import { hooks } from "../../../connectors/walletConnect";

type WalletConnectButtonProps = {
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

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  connector,
}) => {
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
      Wallet Connect
    </Button>
  );
};
export default WalletConnectButton;
