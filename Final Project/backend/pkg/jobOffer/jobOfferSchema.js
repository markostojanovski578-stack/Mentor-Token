const mongoose = require("mongoose");

const jobOfferSchema = new mongoose.Schema({
  job_id: mongoose.Schema.Types.ObjectId,
  mentor_id: mongoose.Schema.Types.ObjectId,
  company_id: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "canceled"],
  },
  type: {
    type: String,
    enum: ["direct", "open"],
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

const JobOffer = mongoose.model("JobOffer", jobOfferSchema);

const createJobOffer = async (offerData) => {
  const offer = new JobOffer(offerData);
  return await offer.save();
};

const getJobOffers = async () => {
  return await JobOffer.find();
};

const getJobOfferById = async (id) => {
  return await JobOffer.findById(id);
};

const updateJobOffer = async (id, offerData) => {
  return await JobOffer.findByIdAndUpdate(
    id,
    {
      ...offerData,
      updated_at: Date.now(),
    },
    { new: true }
  );
};

const deleteJobOffer = async (id) => {
  return await JobOffer.findByIdAndDelete(id);
};

module.exports = {
  createJobOffer,
  getJobOffers,
  getJobOfferById,
  updateJobOffer,
  deleteJobOffer,
};