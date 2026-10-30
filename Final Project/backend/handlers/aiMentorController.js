const mongoose = require("mongoose");
const { chatWithAI } = require("./aiSystem");

const chatAboutMentors = async (req, res) => {
  try {
    if (req.auth.role !== "company") {
      return res.status(403).json({
        error: "Only startups can use the Mentor AI Assistant",
      });
    }

    const { prompt } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    // RETRIEVE - Get mentors from MongoDB
    const User = mongoose.model("User");
    const Job = mongoose.model("Job");

    const mentors = await User.find({ role: "mentor" })
      .select("username mentorSkills mentorDescription")
      .lean();

    const mentorContext = await Promise.all(
      mentors.map(async (mentor) => {
        const completedJobs = await Job.countDocuments({
          mentor_ids: mentor._id,
          status: "completed",
        });

        return (
          `Name: ${mentor.username}\n` +
          `Skills: ${(mentor.mentorSkills || []).join(", ")}\n` +
          `Description: ${mentor.mentorDescription || ""}\n` +
          `Completed Jobs: ${completedJobs}`
        );
      })
    );

    // AUGMENT - Create context for Cohere
    const context = mentorContext.join("\n\n");

    const aiPrompt = `
You are an expert recruiter for MentorToken.

Answer the user's questions using only the mentor information below.
Do not invent mentors, skills, or completed jobs.
If the information is unavailable, explain that clearly.
Answer in the same language as the user's question.

MENTORS:
${context}

QUESTION:
${prompt.trim()}
`;

    // GENERATE - Ask Cohere
    const result = await chatWithAI(aiPrompt);

    if (!result.success) {
      return res.status(500).json({
        error:
          "Our AI is currently out of work, please try in 5 minutes!",
      });
    }

    return res.json({
      success: true,
      answer: result.answer,
    });
  } catch (error) {
    console.error("MENTOR AI ERROR:", error);

    return res.status(500).json({
      error: "Could not process your question",
    });
  }
};

module.exports = { chatAboutMentors };