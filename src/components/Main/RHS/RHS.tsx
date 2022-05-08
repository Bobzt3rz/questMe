import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import AssignedQuests from "./AssignedQuests/AssignedQuests";
import StarterAccordion from "./AssignedQuests/StarterAccordion";
import MyQuests from "./MyQuests/MyQuests";

type RHSProps = {};

const RHS: React.FC<RHSProps> = () => {
  return (
    <>
      <MyQuests />
      <AssignedQuests />
    </>
  );
};
export default RHS;
