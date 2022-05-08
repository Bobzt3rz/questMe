import { logger } from "ethers";
import Moralis from "moralis/types";

Moralis.Cloud.define("hello", async (request) => {
  logger.info("Hello World!");
});
