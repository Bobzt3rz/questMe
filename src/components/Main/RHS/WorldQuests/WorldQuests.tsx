import { Box, Text } from "@chakra-ui/react";
import Moralis from "moralis/types";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

type WorldQuestsProps = {};

const WorldQuests: React.FC<WorldQuestsProps> = () => {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
    Moralis,
  } = useMoralis();
  const [values, setValues] = useState(null);

  let subscription;

  useEffect(() => {}, []);

  useEffect(() => {
    (async () => {
      try {
        console.log(values);
        // const results = await values.query().find();
        // console.log(`Has been updated! There are now ${results.length} quests`);
      } catch (error) {
        console.log("No quests yet");
      }
    })();
  }, [values]);

  return <Text>HI</Text>;
};
export default WorldQuests;
