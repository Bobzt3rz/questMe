import React from "react";
import { auth } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { SiIconify } from "react-icons/si";
import RightContent from "./RightContent/RightContent";
import { useRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(auth);
  const [modalState, setModalState] = useRecoilState(authModalState);

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
      border="1px"
      borderColor="red.200"
    >
      <Flex align="center" justify="left">
        <Icon as={SiIconify} fontSize={30} mr={4} />
        <Text>Quest Quest</Text>
      </Flex>
      <Flex align="center" justify="right">
        <RightContent user={user} />
      </Flex>
    </Flex>
  );
};
export default Navbar;
