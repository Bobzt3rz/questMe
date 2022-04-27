import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
  children: React.ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex border="1px solid orange" justify="center" p="16px 0px">
      <Flex
        width="95%"
        justify="center"
        border="1px solid red"
        direction={{ base: "column", md: "row" }}
      >
        {/* LHS */}
        <Flex
          border="1px solid blue"
          direction="column"
          width={{ base: "100%", md: "35%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* RHS */}
        <Flex
          border="1px solid green"
          direction="column"
          flexGrow={1}
          display="flex"
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
