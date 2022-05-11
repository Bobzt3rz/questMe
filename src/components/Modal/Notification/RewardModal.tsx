import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { rewardModalState } from "../../../atoms/rewardModalAtom";

type RewardModalProps = {};

const RewardModal: React.FC<RewardModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(rewardModalState);
  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Modal isOpen={modalState.open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            You have received {modalState.number} {modalState.token}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default RewardModal;
