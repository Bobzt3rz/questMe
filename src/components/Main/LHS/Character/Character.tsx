import { Box, Image } from "@chakra-ui/react";
import React from "react";

type CharacterProps = {};

const Character: React.FC<CharacterProps> = () => {
  return (
    <Box boxSize="lg">
      <Image src="/images/hero_placeholder.png" alt="hero" />
    </Box>
  );
};
export default Character;
