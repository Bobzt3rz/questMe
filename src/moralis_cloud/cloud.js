Moralis.Cloud.define("isUniqueUsername", async (request) => {
  const query = new Moralis.Query("User");
  const results = await query
    .equalTo("username", request.params.username)
    .find({ useMasterKey: true });
  logger.info(results);
  return results.length > 0 ? false : true;
});
