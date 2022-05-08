import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Input,
  Flex,
  Button,
} from "@chakra-ui/react";
import Moralis from "moralis/types";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";

type StarterAccordionProps = {
  quests: Moralis.Object<Moralis.Attributes>[];
};

const StarterAccordion: React.FC<StarterAccordionProps> = ({ quests }) => {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
    chainId,
    Moralis,
  } = useMoralis();

  const [textboxValue, setTextboxValue] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const handleChange = (event) => setTextboxValue(event.target.value);

  const onClick = async (header, value) => {
    setButtonLoading(true);
    if (header == "A name for an adventurer!") {
      user.set("username", value);
      await user.save();
      setButtonLoading(false);
    }
  };

  return (
    <>
      <Accordion key={"something"} allowToggle>
        {quests.map((quest) => (
          <AccordionItem className="quest" key={quest.attributes.createdAt}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {quest.attributes.header}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {quest.attributes.body}
              {quest.attributes.textbox && (
                <Flex>
                  <Input onChange={handleChange}></Input>
                  <Button
                    onClick={() => {
                      onClick(quest.attributes.header, textboxValue);
                    }}
                  >
                    Go
                  </Button>
                </Flex>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
export default StarterAccordion;
