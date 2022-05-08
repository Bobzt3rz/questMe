import {
  useTab,
  useMultiStyleConfig,
  Button,
  Box,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
} from "@chakra-ui/react";
import React from "react";
import Current from "./Current/Current";

type MyQuestsProps = {};

const MyQuests: React.FC<MyQuestsProps> = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Current</Tab>
        <Tab>New</Tab>
        <Tab>Templates</Tab>
        <Tab>Assigned</Tab>
        <Tab>Completed</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Current />
        </TabPanel>
        <TabPanel>2</TabPanel>
        <TabPanel>3</TabPanel>
        <TabPanel>4</TabPanel>
        <TabPanel>5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default MyQuests;
