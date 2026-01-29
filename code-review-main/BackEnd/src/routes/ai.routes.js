const express = require('express');
const router = express.Router();

const aiService = require("../services/ai.service");

router.post("/get-review", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).send("Prompt is required");
    }

    const response = await aiService(code);

    res.status(200).send(response);

  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
