import { Button, Flex, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type CompanionsProps = {};

const Companions: React.FC<CompanionsProps> = () => {
  return (
    <>
      <Flex mb={5}>
        <Button mr={5}>Add</Button>
        <Button>QR</Button>
      </Flex>
      <List>
        <ListItem>
          <Flex>
            <Text>Text</Text>
            <Button size="xs" variant="ghost">
              <Flex>
                <ListIcon as={BsThreeDotsVertical}></ListIcon>
              </Flex>
            </Button>
          </Flex>
        </ListItem>
      </List>
    </>
  );
};
export default Companions;
