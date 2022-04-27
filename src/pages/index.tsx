import type { NextPage } from "next";
import PageContent from "../components/Layout/PageContent";
import Character from "../components/Main/Character";

const Home: NextPage = () => {
  return (
    <>
      <PageContent>
        <>
          <Character />
          <div>Hi</div>
        </>
        <>
          <div>RHS</div>
        </>
      </PageContent>
    </>
  );
};

export default Home;
