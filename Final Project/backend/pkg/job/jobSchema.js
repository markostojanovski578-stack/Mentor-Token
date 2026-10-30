const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company_id: mongoose.Schema.Types.ObjectId,
  mentor_ids: [mongoose.Schema.Types.ObjectId],
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "canceled"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  category: {
  type: String,
  enum: [
    "business",
    "marketing",
    "sales",
    "technology",
    "finance",
    "product",
    "operations",
    "hr"
  ],
}
});

const Job = mongoose.model("Job", jobSchema);

const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

const getJobs = async () => {
  return await Job.find();
};

const getJobById = async (id) => {
  return await Job.findById(id);
};

const updateJob = async (id, jobData) => {
  const existingJob = await Job.findById(id);

  if (!existingJob) return null;

  if (jobData.status === "completed" && existingJob.status !== "completed") {
    jobData.completed_at = new Date();
  }

  return await Job.findByIdAndUpdate(
    id,
    {
      ...jobData,
      updated_at: Date.now(),
    },
    { new: true, runValidators: true }
  );
};

const deleteJob = async (id) => {
  return await Job.findByIdAndDelete(id);
};

const getJobsForMentor = async (mentorId) => {
  return await Job.find({
    mentor_ids: mentorId,
  });
};

const getFinishedJobsForMentor = async (mentorId) => {
  return await Job.find({
    mentor_ids: mentorId,
    status: "completed",
  });
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsForMentor,
  getFinishedJobsForMentor,
};