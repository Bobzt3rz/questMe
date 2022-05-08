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
import { useMoralis } from "react-moralis";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();

  const logOut = async () => {
    await logout();
    console.log("logged out");
  };

  return (
    <>
      <ChooseWalletModal />

      {(!isAuthenticated || !account) && (
        <Button
          onClick={() =>
            setAuthModalState({ open: true, view: "chooseWallet" })
          }
        >
          Connect Wallet
        </Button>
      )}
      {(account || isAuthenticated) && (
        <Button onClick={logOut} disabled={isAuthenticating}>
          Logout
        </Button>
      )}

      <Flex justify="center" align="center">
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
