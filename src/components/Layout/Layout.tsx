import { Flex } from "@chakra-ui/react";
import React from "react";
import Navbar from "../Navbar/Navbar";
import FlexWrapper from "./FlexWrapper";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
