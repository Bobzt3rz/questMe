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

type ChooseWalletModalProps = {};

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = () => {
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

  const [modalState, setModalState] = useRecoilState(authModalState);

  // state if user is logged in
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  // useEffect runs during mounting/dependencies change which is user
  useEffect(() => {
    if (
      user &&
      (mChainId == desiredChainId.id || wChainId == desiredChainId.id)
    )
      handleClose();
  }, [user, mChainId, wChainId]);

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
                <MetaMaskButton connector={metaMask} />
                <WalletConnectButton connector={walletConnect} />
              </>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ChooseWalletModal;
