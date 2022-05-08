import Moralis from "moralis/types";
import React, { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import CurrentAccordion from "./CurrentAccordion";

type CurrentProps = {};

const Current: React.FC<CurrentProps> = () => {
  // hooks
  const [quests, setQuests] = useState(null);
  const questQuery = useMoralisQuery("StarterQuest");

  // functions
  function refresh_quests() {
    (async () => {
      const results = await questQuery.fetch();
      setQuests(results);
    })();
  }

  // run when component mounts for the first time
  useEffect(() => {
    refresh_quests();
  }, []);

  return <>{quests && <CurrentAccordion quests={quests} />}</>;
};
export default Current;
