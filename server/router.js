
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;

// const express = require("express");
// const router = express.Router();

// router.get("/", (req, res) => {
//   res.send({ response: "Server is up and running." });
// });

// module.exports = router;