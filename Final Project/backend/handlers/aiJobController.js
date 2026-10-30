const mongoose = require("mongoose");
const { chatWithAI } = require("./aiSystem");

const chatAboutJobs = async (req, res) => {
  try {
    // Only mentors can access this assistant
    if (req.auth.role !== "mentor") {
      return res.status(403).json({
        error: "Only mentors can use the Job AI Assistant",
      });
    }

    const { prompt } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const User = mongoose.model("User");
    const Job = mongoose.model("Job");

    // Get the currently logged-in mentor
    const mentor = await User.findById(req.auth.id)
      .select("username mentorSkills mentorDescription")
      .lean();

    if (!mentor) {
      return res.status(404).json({
        error: "Mentor not found",
      });
    }

    // Retrieve available jobs
    const jobs = await Job.find({
      status: "pending",
    })
      .select("title description category status")
      .lean();

    // Create mentor context
    const mentorContext = `
Name: ${mentor.username}
Skills: ${(mentor.mentorSkills || []).join(", ")}
Description: ${mentor.mentorDescription || ""}
`;

    // Create job context
    const jobContext = jobs
      .map((job, index) => {
        return `
Job ${index + 1}:
Title: ${job.title}
Description: ${job.description}
Category: ${job.category || "Not specified"}
`;
      })
      .join("\n");

    // Combine MongoDB data with the user's question
    const aiPrompt = `
You are an AI Job Assistant for MentorToken.

Your task is to help mentors find suitable jobs.

Use only the mentor information and available jobs provided below.
Do not invent jobs or skills.
Recommend jobs based on how well they match the mentor's skills.
If no suitable jobs exist, explain that clearly.
Answer in the same language as the user's question.

MENTOR INFORMATION:
${mentorContext}

AVAILABLE JOBS:
${jobContext || "No available jobs."}

MENTOR'S QUESTION:
${prompt.trim()}
`;

    // Send the augmented prompt to Cohere
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
    console.error("JOB AI ERROR:", error);

    return res.status(500).json({
      error: "Could not process your question",
    });
  }
};

module.exports = { chatAboutJobs };