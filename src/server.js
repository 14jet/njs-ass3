require("dotenv").config();
process.env["NODE_CONFIG_DIR"] = __dirname + "/configs/";
const logger = require("./helpers/logger"); // ghi log

const { Server } = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://njs-assignment-3-admin.web.app",
      "https://njs-assignment-3.web.app",
    ],
  },
});

// middlewares
app.use(require("./middlewares/cors.middleware"));
app.set("trust proxy", 1);
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(require("./middlewares/sessionConfig.middleware"));
app.use(require("./middlewares/session.middleware"));

// serve static files
app.use("/images", require("./middlewares/staticFile.middleware"));

// routes
app.use("/api/user", require("./routes/user.route"));
app.use("/api/product", require("./routes/product.route"));
app.use("/api/dashboard", require("./routes/dashboard.route"));

// 404
app.all("*", (req, res, next) => {
  return res.status(404).json({ message: "Route not found." });
});

// error handler
app.use((error, req, res, next) => {
  console.error(error);
  const message = `${req.method}\t${req.url}\t`;
  logger(message);
  return res.status(500).json({ message: "Internal server error." });
});

// start database
require("./helpers/connectDB")();

io.on("connection", (socket) => {
  require("./realtime")(socket, io);
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
