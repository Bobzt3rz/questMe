import { Heading } from "@chakra-ui/react";
import React from "react";
import StarterAccordion from "./StarterAccordion";

type RHSProps = {};

const RHS: React.FC<RHSProps> = () => {
  return (
    <>
      <Heading>Quests</Heading>
      <StarterAccordion />
    </>
  );
};
export default RHS;
