var bobiaController = require("../controllers/bobiaController");

var express = require("express");
var router = express.Router();

router.post("/perguntar", async (req, res) =>{
  bobiaController.perguntar(req, res)
})

module.exports = router;
