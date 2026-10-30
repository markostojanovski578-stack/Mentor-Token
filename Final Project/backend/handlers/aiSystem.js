const { CohereClientV2 } = require("cohere-ai");

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const chatWithAI = async (prompt) => {
  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
    });

    const answer = (response.message?.content || [])
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");

    return {
      success: true,
      answer,
    };
  } catch (error) {
    console.error("COHERE ERROR:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { chatWithAI };