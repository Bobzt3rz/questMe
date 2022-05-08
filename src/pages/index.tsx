import type { NextPage } from "next";
import PageContent from "../components/Layout/PageContent";
import Character from "../components/Main/Character";
import RHS from "../components/Main/RHS/RHS";
import StarterAccordion from "../components/Main/RHS/AssignedQuests/StarterAccordion";

const Home: NextPage = () => {
  return (
    <>
      <PageContent>
        <>
          <Character />
          <div>Hi</div>
        </>
        <>
          <RHS />
        </>
      </PageContent>
    </>
  );
};

export default Home;
