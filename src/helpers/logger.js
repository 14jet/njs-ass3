// ghi log

const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const rootDir = require("./rootDir");
const filePath = path.join(rootDir, "logs", "error.log");

const logger = (message) => {
  try {
    const messageContent = `${uuid()}\t${format(
      new Date(),
      "hh:mm:ss - dd/MM/yyyy"
    )}\t${message}\n`;

    fs.promises.appendFile(filePath, messageContent);
  } catch (error) {
    console.error(error);
  }
};

module.exports = logger;
