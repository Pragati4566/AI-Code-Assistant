const express = require('express');
const router = express.Router();

router.post("/get-review", async (req, res) => {
  try {
 
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }
    const review = `AI review for: ${text}`;

    res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
});

module.exports = router;
