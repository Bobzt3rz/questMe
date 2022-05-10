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
  Heading,
} from "@chakra-ui/react";
import Moralis from "moralis/types";
import React, { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
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
  // const starterQuests = useMoralisQuery("StarterQuest");
  const [updatedQuests, setUpdatedQuests] = useState(quests);

  // updates connecting wallet quest in database
  useEffect(() => {
    if (user) {
      (async () => {
        let relation = user.relation("starterQuests");
        const userStarterQuestsQuery = await relation.query().find();
        // console.log(`starterQuest is ${starterQuests.data.toString()}`);
        const starterQuests = new Moralis.Query("StarterQuest");
        const starterQuestsQuery = await starterQuests.find();
        console.log(`starterQuestsQuery is ${starterQuestsQuery.length}`);
        console.log(`relationQuery is ${userStarterQuestsQuery.length}`);
        if (
          isAuthenticated &&
          userStarterQuestsQuery.length != starterQuestsQuery.length
        ) {
          starterQuestsQuery.forEach(async function (item, index) {
            try {
              const connectWalletData = {
                isStarterQuest: true,
                index:
                  quests[index + userStarterQuestsQuery.length].attributes
                    .index,
                name: quests[index + userStarterQuestsQuery.length].attributes
                  .name,
                image:
                  quests[index + userStarterQuestsQuery.length].attributes
                    .image,
                body: quests[index + userStarterQuestsQuery.length].attributes
                  .body,
                reward:
                  quests[index + userStarterQuestsQuery.length].attributes
                    .reward,
                button:
                  quests[index + userStarterQuestsQuery.length].attributes
                    .button,
                input:
                  quests[index + userStarterQuestsQuery.length].attributes
                    .input,
                completed: index == 0 ? true : false,
              };

              const UserStarterQuest = await Moralis.Object.extend(
                "UserStarterQuest"
              );
              const userStarterQuest = await new UserStarterQuest(
                connectWalletData
              );
              await userStarterQuest.save();
              relation = user.relation("starterQuests");
              relation.add(userStarterQuest);
              await user.save();
              const results = await relation.query().find();
              console.log(`results is ${results.length}`);
            } catch (error) {
              console.log(error);
            }
          });
        }
        const checkRelation = user.relation("starterQuests");
        const checkResults = await checkRelation
          .query()
          .equalTo("completed", false)
          .ascending("index")
          .find();
        checkResults.forEach(function (item, index) {
          console.log(`item is ${item.attributes.createdAt}`);
        });
        setUpdatedQuests(checkResults);
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
      {!isAuthenticated && (
        <Flex>
          <ChooseWalletModal />
          <Accordion width="100%" allowToggle defaultIndex={0}>
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
                        {quests[0].attributes.completed && (
                          <Button>Submit</Button>
                        )}
                      </HStack>
                    )}
                    {quest.attributes.reward && (
                      <Flex align={"center"}>
                        <Text fontSize="3xl">
                          Reward {quest.attributes.reward}
                        </Text>
                        <Box boxSize="30px">
                          <Image src="/images/eth_png.png" alt="reward_icon" />
                        </Box>
                      </Flex>
                    )}
                    {quest.attributes.button && quest.attributes.index == 0 && (
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
                    {quest.attributes.index != 0 && (
                      <Text color="red.500">Connect to a wallet first!</Text>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
      )}
      {isAuthenticated && (
        <Flex>
          <ChooseWalletModal />
          <Accordion width="100%" allowToggle defaultIndex={0}>
            {updatedQuests.map((quest) => (
              <AccordionItem className="quest" key={quest.attributes.index}>
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
                        <Text fontSize="3xl">
                          Reward {quest.attributes.reward}
                        </Text>
                        <Box boxSize="30px">
                          <Image src="/images/eth_png.png" alt="reward_icon" />
                        </Box>
                      </Flex>
                    )}
                    {quest.attributes.button && (
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
        </Flex>
      )}
    </>
  );
};
export default CurrentAccordion;
