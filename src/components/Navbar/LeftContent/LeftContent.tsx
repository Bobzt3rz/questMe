import { Button, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { GiTiedScroll } from "react-icons/gi";
import { useRecoilState } from "recoil";
import { navbarState } from "../../../atoms/NavbarAtom";

type LeftContentProps = {};

const LeftContent: React.FC<LeftContentProps> = () => {
  const [navbarStateValue, setNavbarState] = useRecoilState(navbarState);

  return (
    <>
      <Icon as={GiTiedScroll} fontSize={30} mr={4} />
      <Text mr={10}>Quest Me</Text>
      <Button
        variant="ghost"
        onClick={() => {
          setNavbarState({ left: "character", right: navbarStateValue.right });
        }}
        isActive={navbarStateValue.left == "character"}
      >
        Character
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setNavbarState({ left: "companions", right: navbarStateValue.right });
        }}
        isActive={navbarStateValue.left == "companions"}
      >
        Companions
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setNavbarState({ left: "inventory", right: navbarStateValue.right });
        }}
        isActive={navbarStateValue.left == "inventory"}
      >
        Inventory
      </Button>
    </>
  );
};
export default LeftContent;
