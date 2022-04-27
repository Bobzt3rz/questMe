import { Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { signInWithCustomToken, User } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect } from "react";
import { SiEthereum } from "react-icons/si";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";
import { desiredChainIdState } from "../../../atoms/desiredChainIdAtom";
import { metaMask, hooks } from "../../../connectors/metaMask";
import { auth } from "../../../firebase/clientApp";
import { AuthWithFirebase } from "../../../firebase/metaMaskAuth";
import AuthModal from "../../Modal/Auth/AuthModal";
import MetaMaskButton from "../../Web3/Connectors/MetaMaskButton";
import MetaMaskCard from "../../Web3/Connectors/MetaMaskCard";
import Provider from "../../Web3/Provider";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
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

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);
  const desiredChainId = useRecoilValue(desiredChainIdState);

  useEffect(() => {
    console.log(`is active is ${isActive}`);
    console.log(`user is ${user}`);
    if (isActive && !user) {
      authWithFirebase();
    }
  }, [isActive]);

  function authWithFirebase() {
    try {
      (async () => {
        // auth with firebase
        const signer = provider.getSigner();
        console.log(signer);
        const address = await signer.getAddress();
        console.log(address);
        //Retrieve the current nonce for the requested address
        const rawResponseNonce = await fetch(
          "https://us-central1-questquest-fe6bd.cloudfunctions.net/getNonceToSign",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address: address }),
          }
        );
        const contentNonce = await rawResponseNonce.json();
        console.log(contentNonce);

        // Get the user to sign the nonce with their private key
        const signature = await signer.signMessage(contentNonce.nonce);

        // If the signature is valid, retrieve a custom auth token for Firebase
        const rawResponseToken = await fetch(
          "https://us-central1-questquest-fe6bd.cloudfunctions.net/verifySignedMessage",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: address,
              signature: signature,
            }),
          }
        );
        const contentToken = await rawResponseToken.json();
        console.log(`contentToken is ${contentToken}`);
        console.log(`Token is ${contentToken.token}`);

        // Use the auth token to auth with Firebase
        const authResponse = await signInWithCustomToken(
          auth,
          contentToken.token
        );
        console.log(authResponse);
      })();
    } catch (error) {
      console.log(error);
    }
  }
  // signout from auth
  auth.signOut();

  return (
    <>
      <Provider />
      {(!isActive || !(chainId === desiredChainId.id)) && (
        <MetaMaskButton connector={metaMask} />
      )}

      <Flex justify="center" align="center">
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
