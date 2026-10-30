
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);
require("dotenv").config();


const cors = require("cors");
const express = require("express");
const { expressjwt } = require("express-jwt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { handleChatRequest } = require("./handlers/aiController");
const { chatAboutMentors } = require("./handlers/aiMentorController");
const { chatAboutJobs } = require("./handlers/aiJobController");


const { init } = require("./pkg/db/db");
init();

const { login, register } = require("./handlers/authHandler");
const {
  getUserById,
  getAllMentors,
} = require("./pkg/user/userSchema");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsForMentor,
  getFinishedJobsForMentor,
} = require("./pkg/job/jobSchema");

const {
  createJobOffer,
  getJobOffers,
  getJobOfferById,
  updateJobOffer,
  deleteJobOffer,
} = require("./pkg/jobOffer/jobOfferSchema");

const {
  createJobApplication,
  getJobApplications,
  getJobApplicationById,
  updateJobApplication,
  deleteJobApplication,
  getApplicationsForMentor,
} = require("./pkg/jobApplication/jobApplicationSchema");

// Startup photo uploads

const uploadFolder = path.join(__dirname, "uploads");

fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      crypto.randomUUID() +
        path.extname(file.originalname).toLowerCase()
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WebP images are allowed"));
    }
  },
});

// Express

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadFolder));

// Authentication

app.use(
  expressjwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
  }).unless({
    path: [
      "/api/auth/login",
      "/api/auth/register",
      /^\/uploads\//,
    ],
  })
);

app.post("/api/auth/login", login);

app.post(
  "/api/auth/register",
  upload.single("startupPhoto"),
  register
);

app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = await getAllMentors();

    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.get("/api/mentor-profile", async (req, res) => {
  try {
    const user = await getUserById(req.auth.id);

    if (!user || user.role !== "mentor") {
      return res.status(404).json({
        error: "Mentor not found",
      });
    }

    res.json({
      username: user.username,
      email: user.email,
      mentorSkills: user.mentorSkills || [],
      mentorDescription: user.mentorDescription || "",
      mentorPhoto: user.mentorPhoto || "",
      mentorLinkedin: user.mentorLinkedin || "",
      mentorPhone: user.mentorPhone || "",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/mentor-profile", async (req, res) => {
  try {
    const user = await getUserById(req.auth.id);

    if (!user || user.role !== "mentor") {
      return res.status(404).json({
        error: "Mentor not found",
      });
    }

    const { mentorSkills, mentorDescription, mentorPhone } = req.body;

    if (
      !Array.isArray(mentorSkills) ||
      mentorSkills.length > 3 ||
      mentorSkills.some((skill) => typeof skill !== "string")
    ) {
      return res.status(400).json({
        error: "Please provide up to 3 skills",
      });
    }

    if (typeof mentorDescription !== "string") {
      return res.status(400).json({
        error: "Invalid description",
      });
    }

    user.mentorSkills = mentorSkills.map((skill) => skill.trim());
    user.mentorDescription = mentorDescription.trim();


    if (typeof mentorPhone !== "string" || mentorPhone.length > 30) {
    return res.status(400).json({ error: "Invalid phone number" });
    }

user.mentorPhone = mentorPhone.trim();
    await user.save();

    res.json({
      status: "success",
      mentorSkills: user.mentorSkills,
      mentorDescription: user.mentorDescription,
      mentorPhone: user.mentorPhone,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(
  "/api/mentor-profile/photo",
  upload.single("mentorPhoto"),
  async (req, res) => {
    try {
      const user = await getUserById(req.auth.id);

      if (!user || user.role !== "mentor") {
        return res.status(404).json({
          error: "Mentor not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Please select a picture",
        });
      }

      user.mentorPhoto = "/uploads/" + req.file.filename;

      await user.save();

      res.json({
        status: "success",
        mentorPhoto: user.mentorPhoto,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// =========================
// MY STATS
// =========================



app.get("/api/my-stats", async (req, res) => {
  try {
    const mentorId = req.auth.id;

    const assignedJobs = await getJobsForMentor(mentorId);
    const finishedJobs = await getFinishedJobsForMentor(mentorId);
    const applications = await getApplicationsForMentor(mentorId);

    const totalJobs = assignedJobs.length + applications.length;

    const assignedJobsData = assignedJobs.map((job) => ({
      date: job.created_at,
      count: 1,
    }));

    const appliedJobsData = applications.map((application) => ({
      date: application.created_at,
      count: 1,
    }));

    const finishedJobsData = finishedJobs.map((job) => ({
      date: job.created_at,
      count: 1,
    }));

    res.json({
      totalJobs: totalJobs,
      assignedJobs: assignedJobs.length,
      appliedJobs: applications.length,
      finishedJobs: finishedJobs.length,

      assignedJobsData: assignedJobsData,
      appliedJobsData: appliedJobsData,
      finishedJobsData: finishedJobsData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// =========================
// MENTOR DASHBOARD
// =========================

app.get("/api/mentor-dashboard", async (req, res) => {
  try {
    const mentorId = req.auth.id;

    // A. Assigned Jobs
    const assignedJobs = await getJobsForMentor(mentorId);

    // B. Pending Jobs
    const allJobOffers = await getJobOffers();

    const directOffers = allJobOffers.filter(
      (offer) =>
        offer.mentor_id &&
        offer.mentor_id.toString() === mentorId &&
        offer.type === "direct" &&
        offer.status === "pending"
    );

    const pendingJobs = [];

    for (const offer of directOffers) {
      const job = await getJobById(offer.job_id);

      if (job) {
        pendingJobs.push({
          jobOfferId: offer._id,
          jobId: job._id,
          jobTitle: job.title,
          description: job.description,
          status: offer.status,
        });
      }
    }

    // C. Rejected Jobs
    const rejectedOffers = allJobOffers.filter(
      (offer) =>
        offer.mentor_id &&
        offer.mentor_id.toString() === mentorId &&
        offer.type === "direct" &&
        offer.status === "rejected"
    );

    const rejectedJobs = [];

    for (const offer of rejectedOffers) {
      const job = await getJobById(offer.job_id);

      if (job) {
        rejectedJobs.push({
          jobOfferId: offer._id,
          jobId: job._id,
          title: job.title,
          description: job.description,
          status: "rejected",
        });
      }
    }

    // D. Applications Sent
    const applications = await getApplicationsForMentor(mentorId);

    const applicationsSent = [];

    for (const application of applications) {
      const offer = await getJobOfferById(application.job_offer_id);

      if (offer) {
        const job = await getJobById(offer.job_id);

        if (job) {
          applicationsSent.push({
            applicationId: application._id,
            jobOfferId: offer._id,
            jobId: job._id,
            jobTitle: job.title,
            description: job.description,
            status: application.status,
          });
        }
      }
    }

    res.json({
      assignedJobs: assignedJobs,
      pendingJobs: pendingJobs,
      rejectedJobs: rejectedJobs,
      applicationsSent: applicationsSent,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// =========================
// JOBS CRUD
// =========================

app.post("/api/jobs", async (req, res) => {
  try {
    const job = await createJob(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await getJobs();

    const jobsWithCompanies = [];

    for (const job of jobs) {
      const company = await getUserById(job.company_id);

      jobsWithCompanies.push({
        ...job.toObject(),
        companyName: company ? company.username : "Unknown Company",
      });
    }

    res.json(jobsWithCompanies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/jobs/:id", async (req, res) => {
  try {
    const job = await updateJob(req.params.id, req.body);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const job = await deleteJob(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =========================
// JOB OFFERS CRUD
// =========================

app.post("/api/job-offers", async (req, res) => {
  try {
    const offer = await createJobOffer(req.body);
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/job-offers", async (req, res) => {
  try {
    const offers = await getJobOffers();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/job-offers/:id", async (req, res) => {
  try {
    const offer = await getJobOfferById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Job offer not found" });
    }

    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/job-offers/:id", async (req, res) => {
  try {
    const offer = await updateJobOffer(req.params.id, req.body);

    if (!offer) {
      return res.status(404).json({ error: "Job offer not found" });
    }

    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =========================
// ACCEPT JOB OFFER
// =========================

app.patch("/api/job-offers/:id/accept", async (req, res) => {
  try {
    const offer = await getJobOfferById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        error: "Job offer not found",
      });
    }

    if (
      !offer.mentor_id ||
      offer.mentor_id.toString() !== req.auth.id
    ) {
      return res.status(403).json({
        error: "Not allowed",
      });
    }

    const job = await getJobById(offer.job_id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    await updateJobOffer(req.params.id, {
      status: "accepted",
      updated_at: new Date(),
    });

    const mentorIds = job.mentor_ids || [];

    const mentorAlreadyAssigned = mentorIds.some(
      (mentorId) => mentorId.toString() === req.auth.id
    );

    if (!mentorAlreadyAssigned) {
      mentorIds.push(req.auth.id);
    }

    const updatedJob = await updateJob(job._id, {
      mentor_ids: mentorIds,
      status: "in_progress",
      updated_at: new Date(),
    });

    res.json({
      status: "success",
      message: "Job accepted",
      job: updatedJob,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// =========================
// REJECT JOB OFFER
// =========================

app.patch("/api/job-offers/:id/reject", async (req, res) => {
  try {
    const offer = await getJobOfferById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        error: "Job offer not found",
      });
    }

    if (
      !offer.mentor_id ||
      offer.mentor_id.toString() !== req.auth.id
    ) {
      return res.status(403).json({
        error: "Not allowed",
      });
    }

    const updatedOffer = await updateJobOffer(req.params.id, {
      status: "rejected",
      updated_at: new Date(),
    });

    res.json({
      status: "success",
      message: "Job rejected",
      offer: updatedOffer,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.delete("/api/job-offers/:id", async (req, res) => {
  try {
    const offer = await deleteJobOffer(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Job offer not found" });
    }

    res.json({ message: "Job offer deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// =========================
// JOB APPLICATIONS CRUD
// =========================

app.post("/api/job-applications/apply", async (req, res) => {
  try {
    const mentorId = req.auth.id;
    const { job_offer_id } = req.body;

    const offer = await getJobOfferById(job_offer_id);

    if (
      !offer ||
      offer.type !== "open" ||
      offer.status !== "pending"
    ) {
      return res.status(400).json({
        error: "This job is not accepting applications",
      });
    }

    const job = await getJobById(offer.job_id);

    if (!job || job.status !== "pending") {
      return res.status(400).json({
        error: "This job is no longer available",
      });
    }

    const applications = await getApplicationsForMentor(mentorId);

    const alreadyApplied = applications.some(
      (application) =>
        String(application.job_offer_id) === String(offer._id)
    );

    if (alreadyApplied) {
      return res.status(409).json({
        error: "You have already applied for this job",
      });
    }

    const application = await createJobApplication({
      job_offer_id: offer._id,
      mentor_id: mentorId,
      status: "applied",
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/job-applications", async (req, res) => {
  try {
    const application = await createJobApplication(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/job-applications", async (req, res) => {
  try {
    const applications = await getJobApplications();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/job-applications/:id", async (req, res) => {
  try {
    const application = await getJobApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({
        error: "Job application not found",
      });
    }

    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/job-applications/:id", async (req, res) => {
  try {
    const application = await updateJobApplication(
      req.params.id,
      req.body
    );

    if (!application) {
      return res.status(404).json({
        error: "Job application not found",
      });
    }

    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/job-applications/:id", async (req, res) => {
  try {
    const application = await deleteJobApplication(req.params.id);

    if (!application) {
      return res.status(404).json({
        error: "Job application not found",
      });
    }

    res.json({
      message: "Job application deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/startup-quick-overview", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Startup account required",
      });
    }

    const User = mongoose.model("User");
    const Job = mongoose.model("Job");

    const now = new Date();

    const lastMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const thisMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const totalMembers = await User.countDocuments({
      role: "mentor",
      created_at: {
        $gte: lastMonthStart,
        $lt: thisMonthStart,
      },
    });

    const totalAssignedJobs = await Job.countDocuments({
  "mentor_ids.0": { $exists: true },
  status: { $in: ["in_progress", "completed"] },
});

    const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const finishedJobs = await Job.countDocuments({
  status: "completed",
  completed_at: {
    $gte: oneMonthAgo,
    $lte: new Date(),
  },
});

    res.json({
      totalMembers,
      totalAssignedJobs,
      finishedJobs,
    });
  } catch (error) {
    console.log("STARTUP OVERVIEW ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});


app.get("/api/startup-jobs", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Startup account required",
      });
    }

    const Job = mongoose.model("Job");

    const jobs = await Job.find({
      company_id: startup._id,
    }).sort({ created_at: -1 });

    res.json(
      jobs.map((job) => ({
        ...job.toObject(),
        companyName: startup.startupName || startup.username,
        companyPhoto: startup.startupPhoto || "",
      }))
    );
  } catch (error) {
    console.log("STARTUP JOBS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/startup-jobs", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Only startups can create jobs",
      });
    }

    const { title, description, category } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        error: "Job title and description are required",
      });
    }

    const allowedCategories = [
      "business",
      "marketing",
      "sales",
      "technology",
      "finance",
      "product",
      "operations",
      "hr",
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: "Please select a valid category",
      });
    }

    const job = await createJob({
      title: title.trim(),
      description: description.trim(),
      category,
      company_id: startup._id,
      mentor_ids: [],
      status: "pending",
    });

    res.status(201).json({
      ...job.toObject(),
      companyName: startup.startupName || startup.username,
      companyPhoto: startup.startupPhoto || "",
    });
  } catch (error) {
    console.log("CREATE STARTUP JOB ERROR:", error);
    res.status(500).json({
      error: "Could not create job",
    });
  }
});

// STARTUP - JOBS ASSIGNED TO A SPECIFIC MENTOR

app.get("/api/startup-mentor/:mentorId/jobs", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Startup account required",
      });
    }

    const mentor = await getUserById(req.params.mentorId);

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({
        error: "Mentor not found",
      });
    }

    const Job = mongoose.model("Job");

    const jobs = await Job.find({
      company_id: startup._id,
      mentor_ids: mentor._id,
    }).sort({ created_at: -1 });

    res.json(jobs);
  } catch (error) {
    console.log("STARTUP MENTOR JOBS ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// STARTUP - SEND DIRECT JOB OFFER TO MENTOR

app.post("/api/startup-job-offers", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Startup account required",
      });
    }

    const { jobId, mentorId } = req.body;

    if (
      !mongoose.isValidObjectId(jobId) ||
      !mongoose.isValidObjectId(mentorId)
    ) {
      return res.status(400).json({
        error: "Invalid job or mentor",
      });
    }

    const mentor = await getUserById(mentorId);
    const job = await getJobById(jobId);

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({
        error: "Mentor not found",
      });
    }

    if (!job || String(job.company_id) !== String(startup._id)) {
      return res.status(404).json({
        error: "Job not found for this startup",
      });
    }

    if (job.status !== "pending") {
      return res.status(400).json({
        error: "Only pending jobs can receive new offers",
      });
    }

    const existingOffers = await getJobOffers();

    const alreadyPending = existingOffers.some(
      (offer) =>
        String(offer.job_id) === String(jobId) &&
        String(offer.mentor_id) === String(mentorId) &&
        offer.type === "direct" &&
        offer.status === "pending"
    );

    if (alreadyPending) {
      return res.status(409).json({
        error: "This mentor already has a pending offer for this job",
      });
    }

    const offer = await createJobOffer({
      job_id: job._id,
      mentor_id: mentor._id,
      type: "direct",
      status: "pending",
    });

    res.status(201).json(offer);
  } catch (error) {
    console.log("SEND JOB OFFER ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// GET PENDING JOB OFFERS FOR SELECTED MENTOR

app.get("/api/startup-mentor/:mentorId/offers", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({ error: "Startup account required" });
    }

    const mentor = await getUserById(req.params.mentorId);

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const Job = mongoose.model("Job");
    const JobOffer = mongoose.model("JobOffer");

    const jobs = await Job.find({ company_id: startup._id }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    const offers = await JobOffer.find({
      job_id: { $in: jobIds },
      mentor_id: mentor._id,
      type: "direct",
      status: "pending",
    }).sort({ created_at: -1 });

    const result = await Promise.all(
      offers.map(async (offer) => {
        const job = await getJobById(offer.job_id);

        return {
          _id: offer._id,
          jobId: offer.job_id,
          jobTitle: job?.title || "Untitled Job",
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.log("PENDING OFFERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// CANCEL A PENDING JOB OFFER

app.patch("/api/startup-job-offers/:id/cancel", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({ error: "Startup account required" });
    }

    const offer = await getJobOfferById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const job = await getJobById(offer.job_id);

    if (!job || String(job.company_id) !== String(startup._id)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (offer.type !== "direct" || offer.status !== "pending") {
      return res.status(400).json({
        error: "Only pending direct offers can be canceled",
      });
    }

    await updateJobOffer(offer._id, {
      status: "canceled",
      updated_at: new Date(),
    });

    res.json({ message: "Offer canceled successfully" });
  } catch (error) {
    console.log("CANCEL OFFER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// STARTUP DASHBOARD - ASSIGNED AND REJECTED JOBS

app.get("/api/startup-dashboard-jobs", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Startup account required",
      });
    }

    const Job = mongoose.model("Job");

    const assignedJobs = await Job.find({
      company_id: startup._id,
      status: { $in: ["in_progress", "completed"] },
      "mentor_ids.0": { $exists: true },
    }).sort({ created_at: -1 });

    const startupJobs = await Job.find({
      company_id: startup._id,
    }).select("_id title");

    const jobMap = new Map(
      startupJobs.map((job) => [String(job._id), job])
    );

    const allOffers = await getJobOffers();

    const rejectedJobs = allOffers
      .filter((offer) => {
        return (
          offer.type === "direct" &&
          offer.status === "rejected" &&
          jobMap.has(String(offer.job_id))
        );
      })
      .map((offer) => {
        const job = jobMap.get(String(offer.job_id));

        return {
          _id: job._id,
          jobOfferId: offer._id,
          title: job.title,
          status: "rejected",
        };
      });

    res.json({
      assignedJobs,
      rejectedJobs,
    });
  } catch (error) {
    console.log("STARTUP DASHBOARD JOBS ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// STARTUP COMPLETED JOBS STATISTICS

app.get("/api/startup-completed-stats", async (req, res) => {
  try {
    const startup = await getUserById(req.auth.id);

    if (!startup || startup.role !== "company") {
      return res.status(403).json({
        error: "Startup account required",
      });
    }

    const Job = mongoose.model("Job");

    const year = new Date().getFullYear();

    const yearStart = new Date(Date.UTC(year, 0, 1));
    const nextYearStart = new Date(Date.UTC(year + 1, 0, 1));

    const completedJobs = await Job.find({
      company_id: startup._id,
      status: "completed",
      completed_at: {
        $gte: yearStart,
        $lt: nextYearStart,
      },
    }).select("completed_at");

    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyData = months.map((month) => ({
      month,
      count: 0,
    }));

    completedJobs.forEach((job) => {
      const monthIndex = new Date(
        job.completed_at
      ).getUTCMonth();

      monthlyData[monthIndex].count += 1;
    });

    res.json({
      year,
      totalCompleted: completedJobs.length,
      monthlyData,
    });
  } catch (error) {
    console.log("STARTUP STATS ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/api/ai/test", (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (!["company", "mentor"].includes(req.auth.role)) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  next();
}, handleChatRequest);

app.post("/api/ai/chat/mentors", chatAboutMentors);
app.post("/api/ai/chat/jobs", chatAboutJobs);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log("Server not started", err.message);
  }

  console.log(`Server started at port: ${PORT}`);
});