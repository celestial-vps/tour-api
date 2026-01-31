const express = require("express");
const searchController = require("./modules/search-intent/search.controller");

const router = express.Router();

router.post("/search-intent", searchController.parse);

module.exports = router;
