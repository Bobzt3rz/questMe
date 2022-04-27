import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { useRecoilValue } from "recoil";
import { desiredChainIdState } from "../atoms/desiredChainIdAtom";
import { getAddChainParameters } from "../chains";
import { hooks, metaMask } from "../connectors/metaMask";
import { auth } from "./clientApp";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

export function AuthWithFirebase() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const desiredChainId = useRecoilValue(desiredChainIdState);
  console.log("hi");
  try {
    (async () => {
      // auth with firebase
      const rawResponse = await fetch(
        "https://us-central1-questquest-fe6bd.cloudfunctions.net/getNonceToSign",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: accounts[0] }),
        }
      );
      const content = await rawResponse.json();
      console.log(content);

      const signer = provider.getSigner();
      console.log(signer);
      const signature = await signer.signMessage(content.nonce);
      console.log(signature);
    })();
  } catch (error) {
    console.log(error);
  }
}
