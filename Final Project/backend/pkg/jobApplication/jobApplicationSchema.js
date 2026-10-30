const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  job_offer_id: mongoose.Schema.Types.ObjectId,
  mentor_id: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ["applied", "accepted", "rejected"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);

const createJobApplication = async (applicationData) => {
  const application = new JobApplication(applicationData);
  return await application.save();
};

const getJobApplications = async () => {
  return await JobApplication.find();
};

const getJobApplicationById = async (id) => {
  return await JobApplication.findById(id);
};

const updateJobApplication = async (id, applicationData) => {
  return await JobApplication.findByIdAndUpdate(
    id,
    {
      ...applicationData,
      updated_at: Date.now(),
    },
    { new: true }
  );
};

const deleteJobApplication = async (id) => {
  return await JobApplication.findByIdAndDelete(id);
};


const getApplicationsForMentor = async (mentorId) => {
  return await JobApplication.find({
    mentor_id: mentorId,
  });
};


module.exports = {
  createJobApplication,
  getJobApplications,
  getJobApplicationById,
  updateJobApplication,
  deleteJobApplication,
  getApplicationsForMentor,
};