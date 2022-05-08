import { Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisCloudFunction,
  useMoralisQuery,
} from "react-moralis";
import StarterAccordion from "./StarterAccordion";

type AssignedQuestsProps = {};

const AssignedQuests: React.FC<AssignedQuestsProps> = () => {
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

  const [quests, setQuests] = useState(null);

  const questQuery = useMoralisQuery("Quest");

  function refresh_quests() {
    console.log(questQuery);
    (async () => {
      const results = await questQuery.fetch();
      setQuests(results);
      console.log(results);
      results.forEach(function (item, index) {
        console.log(item.attributes.header);
      });
    })();
  }

  function create_starter_quests() {
    (async () => {
      const QuestObject = Moralis.Object.extend("Quest");
      const createUsernameQuest = new QuestObject();
      createUsernameQuest.set("creator", user.get("ethAddress"));
      createUsernameQuest.set("recipient", user.get("ethAddress"));
      createUsernameQuest.set("chainId", chainId);
      createUsernameQuest.set("type", "starter");
      createUsernameQuest.set("status", "assigned");
      createUsernameQuest.set("update_creator", false);
      createUsernameQuest.set("update_recipient", true);
      createUsernameQuest.set("header", "A name for an adventurer!");
      createUsernameQuest.set("body", "Enter your name below!");
      createUsernameQuest.set("submission_file", null);
      createUsernameQuest.set(
        "reward_token_id",
        "0x2170ed0880ac9a755fd29b2688956bd959f933f8"
      );
      createUsernameQuest.set("reward_token_num", 10);
      createUsernameQuest.set(
        "chat",
        Array.from(Array(2), () => new Array(4))
      );
      createUsernameQuest.set("textbox", true);
      createUsernameQuest.save().then(
        (createUsernameQuest) => {
          console.log("Object_saved_succesfully");
          console.log(createUsernameQuest);
        },
        (error) => {
          console.log("object save failed");
          console.log(error);
        }
      );
    })();
  }

  return (
    <>
      <Flex justify={"space-between"} padding={[2, 2]} ml={3}>
        <Heading>Quests</Heading>
        <Flex mr={10}>
          <Button onClick={() => create_starter_quests()}>Assign Quest</Button>
          <Button onClick={() => refresh_quests()}>Refresh</Button>
        </Flex>
      </Flex>
      {quests && <StarterAccordion quests={quests} />}
    </>
  );
};
export default AssignedQuests;
