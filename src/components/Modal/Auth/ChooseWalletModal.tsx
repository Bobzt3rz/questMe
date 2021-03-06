import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { desiredChainIdState } from "../../../atoms/desiredChainIdAtom";
import { hooks as mHooks, metaMask } from "../../../connectors/metaMask";
import {
  walletConnect,
  hooks as wHooks,
} from "../../../connectors/walletConnect";
import { auth } from "../../../firebase/clientApp";
import MetaMaskButton from "../../Web3/Connectors/MetaMaskButton";
import WalletConnectButton from "../../Web3/Connectors/WalletConnectButton";
import { useChain, useMoralis } from "react-moralis";
import MoralisType, { Moralis } from "moralis";

type ChooseWalletModalProps = {};

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = () => {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();

  const [modalState, setModalState] = useRecoilState(authModalState);
  const desiredChainId = useRecoilValue(desiredChainIdState);

  useEffect(() => {
    if (isAuthenticated) {
      handleClose();
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const login = (provider: MoralisType.Web3ProviderType) => {
    (async () => {
      if (!isAuthenticated || !account) {
        await authenticate({
          signingMessage: "Log in to QuestMe",
          provider: provider,
        })
          .then(function (user) {
            console.log("logged in user:", user);
            console.log(user!.get("ethAddress"));
            console.log(`chainId is ${chainId}`);
          })
          .catch(function (error) {
            console.log(error);
          });
        switchNetwork(desiredChainId.id);
      }
    })();
  };

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
              gap="15px"
            >
              <>
                <Button onClick={() => login("metamask")}>MetaMask</Button>
                <Button onClick={() => login("magicLink")}>MagicLink</Button>
                <Button onClick={() => login("walletconnect")}>
                  WalletConnect
                </Button>
                <Button onClick={() => login("web3Auth")}>Web3Auth</Button>
                <Button onClick={() => login("wc")}>wc</Button>
              </>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ChooseWalletModal;
