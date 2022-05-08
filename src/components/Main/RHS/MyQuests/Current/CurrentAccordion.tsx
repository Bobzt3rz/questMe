import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Input,
  Button,
  Image,
  Text,
  HStack,
} from "@chakra-ui/react";
import Moralis from "moralis/types";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../../../atoms/authModalAtom";
import ChooseWalletModal from "../../../../Modal/Auth/ChooseWalletModal";

type CurrentAccordionProps = {
  quests: Moralis.Object<Moralis.Attributes>[];
};

const CurrentAccordion: React.FC<CurrentAccordionProps> = ({ quests }) => {
  // hooks
  const setAuthModalState = useSetRecoilState(authModalState);
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
    Moralis,
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          quests.forEach(async function (item, index) {
            const userQuest = await Moralis.Object.extend("StarterQuest");
            console.log(userQuest.get("name"));
            if (index != 0) {
              user.addUnique("currentQuests", item.attributes.index);
            }
          });
          await user.save();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [isAuthenticated]);

  // functions
  function handleQuestButton(quest: Moralis.Object<Moralis.Attributes>) {
    if (quest.attributes.index == 0) {
      setAuthModalState({ open: true, view: "chooseWallet" });
    }
  }

  return (
    <>
      <ChooseWalletModal />
      <Accordion allowToggle defaultIndex={0}>
        {quests.map((quest) => (
          <AccordionItem className="quest" key={quest.attributes.createdAt}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {quest.attributes.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction={"column"} align="center" m={4} gap={2}>
                {quest.attributes.image && (
                  <Box boxSize="200px">
                    <Image
                      src={String(quest.attributes.image.url())}
                      alt="image"
                    />
                  </Box>
                )}
                {quest.attributes.body}
                {quest.attributes.input && (
                  <HStack spacing={3}>
                    <Input />
                    <Button>Submit</Button>
                  </HStack>
                )}
                {quest.attributes.reward && (
                  <Flex align={"center"}>
                    <Text fontSize="3xl">Reward {quest.attributes.reward}</Text>
                    <Box boxSize="30px">
                      <Image src="/images/eth_png.png" alt="reward_icon" />
                    </Box>
                  </Flex>
                )}
                {quest.attributes.button && quest.attributes.completed && (
                  <Flex>
                    <Button
                      onClick={() => {
                        handleQuestButton(quest);
                      }}
                    >
                      {quest.attributes.button}
                    </Button>
                  </Flex>
                )}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
export default CurrentAccordion;
