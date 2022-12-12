const config = require("config");
const cors = require("cors");

const corsOptions = {
  origin: config.get("whiteList"),
  credentials: true,
};

module.exports = cors(corsOptions);
