const { chatWithAI } = require("./aiSystem");

const handleChatRequest = async (req, res) => {
  const { prompt } = req.body || {};

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({
      error: "Prompt is required",
    });
  }

  const result = await chatWithAI(prompt.trim());

  if (!result.success) {
    return res.status(500).json({
      error: "Our AI is currently out of work, please try in 5 minutes!",
    });
  }

  return res.json({
    success: true,
    answer: result.answer,
  });
};

module.exports = { handleChatRequest };