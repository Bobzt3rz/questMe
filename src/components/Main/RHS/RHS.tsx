import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { navbarState } from "../../../atoms/NavbarAtom";
import AssignedQuests from "./AssignedQuests/AssignedQuests";
import StarterAccordion from "./AssignedQuests/StarterAccordion";
import MyQuests from "./MyQuests/MyQuests";
import WorldQuests from "./WorldQuests/WorldQuests";

type RHSProps = {};

const RHS: React.FC<RHSProps> = () => {
  const navbarStateValue = useRecoilValue(navbarState);

  return (
    <>
      {navbarStateValue.right == "my_quests" && <MyQuests />}
      {navbarStateValue.right == "world_quests" && <WorldQuests />}
      <AssignedQuests />
    </>
  );
};
export default RHS;
