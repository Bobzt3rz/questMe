import type { NextPage } from "next";
import PageContent from "../components/Layout/PageContent";
import Character from "../components/Main/LHS/Character/Character";
import RHS from "../components/Main/RHS/RHS";
import StarterAccordion from "../components/Main/RHS/AssignedQuests/StarterAccordion";
import LHS from "../components/Main/LHS/LHS";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const Home: NextPage = () => {
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

  useEffect(() => {
    subscription ? subscription.unsubscribe() : "";
    (async () => {
      let testQuery = new Moralis.Query("TestClass");
      let query = new Moralis.Query("UserStarterQuest");

      subscription = await query
        .equalTo("creator", user.get("ethAddress"))
        .subscribe();

      //   subscription = await relation.query().subscribe();
      subscription.on("open", () => {
        console.log("subscription opened");
      });
      subscription.on("update", (object) => {
        console.log(`object updated: ${object.attributes.name}`);
        setValues(object);
      });
      subscription.on("create", (object) => {
        console.log(`object created: ${object.attributes.name}`);
      });
      subscription.on("close", () => {
        console.log("subscription closed");
      });
      //   const query = await user.fetch();
      //   setValues(query);
      //   console.log(query.attributes.starterQuests[1]);
    })();
  }, [isAuthenticated]);
  return (
    <>
      <PageContent>
        <>
          <LHS />
        </>
        <>
          <RHS />
        </>
      </PageContent>
    </>
  );
};

export default Home;
