import { Button, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithCustomToken,
  User,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { SiEthereum } from "react-icons/si";
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState, AuthModalState } from "../../../atoms/authModalAtom";
import { desiredChainIdState } from "../../../atoms/desiredChainIdAtom";
import { metaMask, hooks as mHooks } from "../../../connectors/metaMask";
import {
  walletConnect,
  hooks as wHooks,
} from "../../../connectors/walletConnect";
import { auth } from "../../../firebase/clientApp";
import AuthModal from "../../Modal/Auth/AuthModal";
import ChooseWalletModal from "../../Modal/Auth/ChooseWalletModal";
import MetaMaskButton from "../../Web3/Connectors/MetaMaskButton";
import MetaMaskCard from "../../Web3/Connectors/MetaMaskCard";
import Provider from "../../Web3/Provider";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

let provider;
let chainId;

const RightContent: React.FC<RightContentProps> = () => {
  // metamask hooks
  const mChainId = mHooks.useChainId();
  const mAccounts = mHooks.useAccounts();
  const mError = mHooks.useError();
  const mIsActivating = mHooks.useIsActivating();
  const mIsActive = mHooks.useIsActive();
  const mProvider = mHooks.useProvider();
  const mENSNames = mHooks.useENSNames(mProvider);

  //wallet connect hooks
  const wChainId = wHooks.useChainId();
  const wError = wHooks.useError();
  const wAccounts = wHooks.useAccounts();
  const wIsActivating = wHooks.useIsActivating();
  const wIsActive = wHooks.useIsActive();
  const wProvider = wHooks.useProvider();
  const wENSNames = wHooks.useENSNames(mProvider);

  const desiredChainId = useRecoilValue(desiredChainIdState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const [user, loading, error] = useAuthState(auth);

  // keep track of number of renders
  const [noOfRender, setNoOfRender] = useState(0);

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  useEffect(() => {
    console.log(`mIsActive is ${mIsActive}`);
    try {
      setNoOfRender(noOfRender + 1);

      if (mProvider) {
        provider = mProvider;
        chainId = mChainId;
      }
      if (wProvider) {
        provider = wProvider;
        chainId = wChainId;
      }
      console.log(`user is ${user}`);
      if ((mIsActive || wIsActive) && !user && noOfRender > 2) {
        authWithFirebase();
      }
      if (!mIsActive && !wIsActive) {
        // auth.signOut();
      }
    } catch (error) {
      console.log(error);
    }
  }, [wIsActive, mIsActive, mProvider, mChainId, wChainId, user]);

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
        const authResponse = setPersistence(auth, browserLocalPersistence)
          .then(() => {
            return signInWithCustomToken(auth, contentToken.token);
          })
          .catch((error) => {
            console.log("error at authResponse");
            console.log(error);
          });
        console.log(authResponse);
      })();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <ChooseWalletModal />

      {!user ||
        (!mIsActive && !wIsActive && (
          <Button
            onClick={() =>
              setAuthModalState({ open: true, view: "chooseWallet" })
            }
          >
            Connect Wallet
          </Button>
        ))}

      <Flex justify="center" align="center">
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
