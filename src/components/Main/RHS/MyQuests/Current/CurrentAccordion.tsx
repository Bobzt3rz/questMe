import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Image,
  Text,
} from "@chakra-ui/react";
import Moralis from "moralis/types";
import React, { startTransition, useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../../../../atoms/authModalAtom";
import { rewardModalState } from "../../../../../atoms/rewardModalAtom";
import ChooseWalletModal from "../../../../Modal/Auth/ChooseWalletModal";
import RewardModal from "../../../../Modal/Notification/RewardModal";

type CurrentAccordionProps = {
  quests: Moralis.Object<Moralis.Attributes>[];
};

const CurrentAccordion: React.FC<CurrentAccordionProps> = ({ quests }) => {
  // hooks

  const setAuthModalState = useSetRecoilState(authModalState);
  const [rewardModalStateValue, setRewardModalState] =
    useRecoilState(rewardModalState);

  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
    Moralis,
  } = useMoralis();
  // update quests after logged in
  const [updatedQuests, setUpdatedQuests] = useState(quests);
  // check if finished updating quests
  const [FinishedUpdatingQuests, setFinishedUpdatingQuests] = useState(false);
  // input
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event) => setInputValue(event.target.value);
  // isUniqueUsername
  const [isUniqueUsername, setIsUniqueUsername] = useState(true);
  // isValidUsername
  const [isValidUsername, setIsValidUsername] = useState(true);
  // check if username checks pass
  const [readyToCompleteUsername, setReadyToCompleteUsername] = useState(false);
  //
  const [state, setState] = useState("start");

  // create starter quests for each new user
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
          try {
            starterQuestsQuery.forEach(async function (item, index) {
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
                readyToComplete: index == 0 ? true : false,
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
            });
          } catch (error) {
            console.log(error);
          }
        }
        await updateQuests();
      })();
    }
  }, [isAuthenticated]);

  // check if the username is unique doesnt need submit button
  // useEffect(() => {
  //   if (inputValue != "") {
  //     startTransition(() => {
  //       // check username is valid
  //       setIsValidUsername(/^[0-9a-zA-Z_.-]+$/.test(inputValue));
  //       console.log(`input is ${inputValue}`);

  //       // check username in database
  //       (async () => {
  //         const params = { username: inputValue };
  //         const results = await Moralis.Cloud.run("isUniqueUsername", params);
  //         setIsUniqueUsername(results);
  //         if (isValidUsername && isUniqueUsername) {
  //           updatedQuests[0].set("readyToComplete", true);
  //           await quests[0].save();
  //           await updateQuests();
  //         } else if (!isValidUsername || !isUniqueUsername) {
  //           updatedQuests[0].set("readyToComplete", false);
  //           await updatedQuests[0].save();
  //           await updateQuests();
  //         }
  //       })();
  //     });
  //   }
  // }, [inputValue]);

  // functions
  function handleLastButton(quest: Moralis.Object<Moralis.Attributes>) {
    if (quest.attributes.index == 0) {
      setAuthModalState({ open: true, view: "chooseWallet" });
    } else {
      (async () => {
        quest.set("completed", true);
        await quest.save();
        await updateQuests();
        setRewardModalState({
          open: true,
          view: "reward",
          token: "YME",
          number: quest.attributes.reward,
        });
      })();
    }
  }
  function handleSubmitButton(quest: Moralis.Object<Moralis.Attributes>) {
    (async () => {
      const params = { username: inputValue };
      const isUniqueUsername = await Moralis.Cloud.run(
        "isUniqueUsername",
        params
      );
      isUniqueUsername ? setIsUniqueUsername(true) : setIsUniqueUsername(false);
      const isValidUsername = /^[0-9a-zA-Z_.-]+$/.test(inputValue);
      isValidUsername ? setIsValidUsername(true) : setIsValidUsername(false);
      if (isUniqueUsername && isValidUsername) {
        user.setUsername(inputValue);
        await user.save();
        quest.set("readyToComplete", true);
        await quest.save();
        setReadyToCompleteUsername(true);
      } else {
        quest.set("readyToComplete", false);
        await quest.save();
        setReadyToCompleteUsername(false);
      }

      await updateQuests();
    })();
  }

  async function updateQuests() {
    const getRelation = user.relation("starterQuests");
    const relationResults = await getRelation
      .query()
      .equalTo("completed", false)
      .ascending("index")
      .find();
    setUpdatedQuests(relationResults);
    setFinishedUpdatingQuests(true);
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
                          <Button
                            onClick={() => {
                              handleSubmitButton(quest);
                            }}
                          >
                            Submit
                          </Button>
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
                            handleLastButton(quest);
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
      {state == "next" && (
        <Flex>
          <RewardModal />
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
                      <>
                        <HStack spacing={3}>
                          <Input onChange={handleInputChange} />
                          <Button
                            onClick={() => {
                              handleSubmitButton(quest);
                            }}
                          >
                            Submit
                          </Button>
                        </HStack>
                        {!isUniqueUsername && (
                          <Text color="red.500">name has been taken</Text>
                        )}
                        {!isValidUsername && (
                          <Text color="red.500">
                            name contains invalid characters
                          </Text>
                        )}
                        {isValidUsername &&
                          isUniqueUsername &&
                          readyToCompleteUsername && (
                            <Text color="green.500">name is valid</Text>
                          )}
                      </>
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
                          isDisabled={!quest.attributes.readyToComplete}
                          onClick={() => {
                            handleLastButton(quest);
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
