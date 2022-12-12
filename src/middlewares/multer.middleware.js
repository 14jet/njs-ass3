const multer = require("multer");
const rootDir = require("../helpers/rootDir");
const path = require("path");

const pathName = path.join(rootDir, "..", "public", "images");
console.log(pathName);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload.array("images", 5);
