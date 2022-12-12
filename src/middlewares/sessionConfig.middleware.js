const session = require("express-session");
const config = require("config");
const sessionConfig = config.get("sessionConfig");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: config.get("mongodbURI"),
  collection: "session",
});

store.on("error", (error) => {
  console.log(error);
});

module.exports = session({ ...sessionConfig, store });
