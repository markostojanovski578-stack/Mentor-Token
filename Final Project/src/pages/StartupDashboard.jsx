import ChatBox from "../components/ChatBox";
import { useEffect, useState } from "react";
import "./StartupDashboard.css";
import "./MentorDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function StartupDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [startupName] = useState(
    localStorage.getItem("startupName") || "Startup"
  );
  const [startupPhoto] = useState(
    localStorage.getItem("startupPhoto") || ""
  );

  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [mentorError, setMentorError] = useState("");
  const [startupJobs, setStartupJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [creatingJob, setCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState("");
  const [quickOverview, setQuickOverview] = useState({
    totalMembers: 0,
    totalAssignedJobs: 0,
    finishedJobs: 0,
  });
  const [selectedOverview, setSelectedOverview] = useState("members");
  const [overviewError, setOverviewError] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorAssignedJobs, setMentorAssignedJobs] = useState([]);
  const [assignedJobsFilter, setAssignedJobsFilter] = useState("all");
  const [loadingAssignedJobs, setLoadingAssignedJobs] = useState(false);
  const [assignedJobsError, setAssignedJobsError] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerJobs, setOfferJobs] = useState([]);
  const [selectedOfferJob, setSelectedOfferJob] = useState("");
  const [loadingOfferJobs, setLoadingOfferJobs] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState("");
  const [mentorPendingOffers, setMentorPendingOffers] = useState([]);
  const [loadingPendingOffers, setLoadingPendingOffers] = useState(false);
  const [pendingOffersError, setPendingOffersError] = useState("");
  const [cancelingOfferId, setCancelingOfferId] = useState(null);
  const [dashboardJobFilter, setDashboardJobFilter] = useState("all");
  const [dashboardAssignedJobs, setDashboardAssignedJobs] = useState([]);
  const [dashboardRejectedJobs, setDashboardRejectedJobs] = useState([]);
  const [loadingDashboardJobs, setLoadingDashboardJobs] = useState(false);
  const [dashboardJobsError, setDashboardJobsError] = useState("");
  const [startupCompletedStats, setStartupCompletedStats] = useState([]);
  const [startupStatsError, setStartupStatsError] = useState("");
  


useEffect(() => {
  if (activePage !== "dashboard") return;

  const getStartupCompletedStats = async () => {
    try {
      setStartupStatsError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:10000/api/startup-completed-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load statistics");
      }

      setStartupCompletedStats(data.monthlyData || []);
    } catch (error) {
      console.log("STARTUP STATS ERROR:", error);
      setStartupStatsError(error.message);
    }
  };

  getStartupCompletedStats();
}, [activePage]);

  useEffect(() => {
    if (activePage !== "dashboard") return;

    const getDashboardJobs = async () => {
      setLoadingDashboardJobs(true);
      setDashboardJobsError("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:10000/api/startup-dashboard-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load dashboard jobs");
        }

        setDashboardAssignedJobs(data.assignedJobs || []);
        setDashboardRejectedJobs(data.rejectedJobs || []);
      } catch (error) {
        console.log("DASHBOARD JOBS ERROR:", error);
        setDashboardJobsError(error.message);
      } finally {
        setLoadingDashboardJobs(false);
      }
    };

    getDashboardJobs();
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "mentors") return;

    const getQuickOverview = async () => {
      try {
        setOverviewError("");
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:10000/api/startup-quick-overview",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load quick overview");
        }

        setQuickOverview(data);
      } catch (error) {
        console.log("QUICK OVERVIEW ERROR:", error);
        setOverviewError(error.message);
      }
    };

    getQuickOverview();
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "jobs") return;

    const getStartupJobs = async () => {
      setLoadingJobs(true);
      setJobsError("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:10000/api/startup-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load jobs");
        }

        setStartupJobs(data);
      } catch (error) {
        console.log("STARTUP JOBS ERROR:", error);
        setJobsError(error.message);
      } finally {
        setLoadingJobs(false);
      }
    };

    getStartupJobs();
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "mentors") return;

    const getMentors = async () => {
      setLoadingMentors(true);
      setMentorError("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:10000/api/mentors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load mentors");
        }

        setMentors(data);
      } catch (error) {
        console.log("Mentor error:", error);
        setMentorError(error.message);
      } finally {
        setLoadingMentors(false);
      }
    };

    getMentors();
  }, [activePage]);

  const getPhotoUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http")) return photo;
    return `http://localhost:10000${
      photo.startsWith("/") ? photo : `/${photo}`
    }`;
  };

  const handleCreateJob = async (event) => {
    event.preventDefault();
    if (creatingJob) return;

    setCreatingJob(true);
    setCreateJobError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:10000/api/startup-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newJob),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create job");
      }

      setStartupJobs((previousJobs) => [data, ...previousJobs]);
      setNewJob({ title: "", description: "", category: "" });
      setActivePage("jobs");
    } catch (error) {
      console.log("CREATE JOB ERROR:", error);
      setCreateJobError(error.message);
    } finally {
      setCreatingJob(false);
    }
  };

  useEffect(() => {
    if (activePage !== "view-mentor" || !selectedMentor?._id) return;

    const getAssignedJobs = async () => {
      setLoadingAssignedJobs(true);
      setAssignedJobsError("");
      setAssignedJobsFilter("all");
      setMentorAssignedJobs([]);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:10000/api/startup-mentor/${selectedMentor._id}/jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load assigned jobs");
        }

        setMentorAssignedJobs(data);
      } catch (error) {
        console.log("ASSIGNED JOBS ERROR:", error);
        setAssignedJobsError(error.message);
      } finally {
        setLoadingAssignedJobs(false);
      }
    };

    getAssignedJobs();
  }, [activePage, selectedMentor?._id]);

  useEffect(() => {
    if (activePage !== "view-mentor" || !selectedMentor?._id) return;
    setMentorPendingOffers([]);
    getMentorPendingOffers(selectedMentor._id);
  }, [activePage, selectedMentor?._id]);

  const handleOpenOfferModal = async () => {
    if (!selectedMentor) return;

    setShowOfferModal(true);
    setSelectedOfferJob("");
    setOfferJobs([]);
    setOfferError("");
    setOfferSuccess("");
    setLoadingOfferJobs(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:10000/api/startup-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load jobs");
      }

      setOfferJobs(data.filter((job) => job.status === "pending"));
    } catch (error) {
      setOfferError(error.message);
    } finally {
      setLoadingOfferJobs(false);
    }
  };

  const handleSendJobOffer = async (event) => {
    event.preventDefault();
    if (!selectedOfferJob || !selectedMentor || sendingOffer) return;

    setSendingOffer(true);
    setOfferError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:10000/api/startup-job-offers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: selectedOfferJob,
            mentorId: selectedMentor._id,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not send job offer");
      }

      setOfferSuccess("Job offer sent successfully!");
      await getMentorPendingOffers(selectedMentor._id);
      setSelectedOfferJob("");
    } catch (error) {
      setOfferError(error.message);
    } finally {
      setSendingOffer(false);
    }
  };

  const getMentorPendingOffers = async (mentorId) => {
    setLoadingPendingOffers(true);
    setPendingOffersError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:10000/api/startup-mentor/${mentorId}/offers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load pending offers");
      }

      setMentorPendingOffers(data);
    } catch (error) {
      setPendingOffersError(error.message);
    } finally {
      setLoadingPendingOffers(false);
    }
  };

  const handleCancelOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to cancel this offer?")) {
      return;
    }

    setCancelingOfferId(offerId);
    setPendingOffersError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:10000/api/startup-job-offers/${offerId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not cancel offer");
      }

      setMentorPendingOffers((previous) =>
        previous.filter((offer) => offer._id !== offerId)
      );
    } catch (error) {
      setPendingOffersError(error.message);
    } finally {
      setCancelingOfferId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("startupName");
    localStorage.removeItem("startupPhoto");
    window.location.href = "/login";
  };

  let filteredDashboardJobs = [];

  if (dashboardJobFilter === "all") {
    filteredDashboardJobs = [
      ...dashboardAssignedJobs,
      ...dashboardRejectedJobs,
    ];
  }

  if (dashboardJobFilter === "done") {
    filteredDashboardJobs = dashboardAssignedJobs.filter(
      (job) => job.status === "completed"
    );
  }

  if (dashboardJobFilter === "rejected") {
    filteredDashboardJobs = dashboardRejectedJobs;
  }

  if (dashboardJobFilter === "in_progress") {
    filteredDashboardJobs = dashboardAssignedJobs.filter(
      (job) => job.status === "in_progress"
    );
  }

  const filteredMentorJobs = mentorAssignedJobs.filter((job) => {
    if (assignedJobsFilter === "all") return true;
    if (assignedJobsFilter === "rejected") return false;
    return job.status === assignedJobsFilter;
  });

  return (
    <main className="mentor-dashboard-main">
      {/* SIDEBAR */}
      <div className="mentor-dashboard-sidebar">
        <img
          className="mentor-dashboard-logo"
          src="/logosolo.png"
          alt="Logo"
        />

        <div className="mentor-dashboard-name">
          Mentor Token
        </div>

        <button
          className="mentor-dashboard-button squares-button"
          onClick={() => setActivePage("dashboard")}
        >
          <img src="/squares.png" alt="" />
          <span>Dashboard</span>
        </button>

        <button
          className="mentor-dashboard-button profile-button"
          onClick={() => setActivePage("mentors")}
        >
          <img src="/profile1.svg" alt="" />
          <span>Mentors</span>
        </button>

        <button
          className="mentor-dashboard-button disc-button"
          onClick={() => setActivePage("jobs")}
        >
          <img src="/disc.png" alt="" />
          <span>Jobs</span>
        </button>

        
        <button
  type="button"
  className="mentor-dashboard-button ai-assistant-sidebar-button"
  onClick={() => setActivePage("assistant")}
>
  <span className="ai-sidebar-icon">✦</span>
  <span>AI Assistant</span>
</button>

        <button
          className="mentor-dashboard-logout-button"
          onClick={handleLogout}
        >
          <img src="/logout.png" alt="" />
          <span>Logout</span>
        </button>
      </div>

      {/* SEARCH AND STARTUP PROFILE */}
      <div className="mentor-dashboard-search">
        <img src="/search-normal.png" alt="" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="startup-dashboard-profile">
        {startupPhoto ? (
          <img src={startupPhoto} alt="Startup" />
        ) : (
          <span>{startupName.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="startup-dashboard-profile-name">
        {startupName}
      </div>

      
        {activePage === "assistant" && (
          <section className="ai-dashboard-section">
            <ChatBox
              endpoint="/api/ai/chat/mentors"
              title="AI Assistant"
              placeholder="Ask me anything..."
            />
          </section>
        )}

        {/* MAIN STARTUP DASHBOARD */}
      {activePage === "dashboard" && (
        <>
          {/* ASSIGNED JOBS */}
          <div className="assigned-jobs-section">
            <div className="dashboard-section-header">
              <h3>Assigned Jobs</h3>

              <div className="assigned-jobs-filters">
                <button
                  className={dashboardJobFilter === "all" ? "active" : ""}
                  onClick={() => setDashboardJobFilter("all")}
                >
                  All
                </button>

                <button
                  className={dashboardJobFilter === "done" ? "active" : ""}
                  onClick={() => setDashboardJobFilter("done")}
                >
                  Done
                </button>

                <button
                  className={dashboardJobFilter === "rejected" ? "active" : ""}
                  onClick={() => setDashboardJobFilter("rejected")}
                >
                  Rejected
                </button>

                <button
                  className={
                    dashboardJobFilter === "in_progress" ? "active" : ""
                  }
                  onClick={() => setDashboardJobFilter("in_progress")}
                >
                  In Progress
                </button>
              </div>
            </div>

            <div className="assigned-jobs-list">
              {loadingDashboardJobs && <p>Loading jobs...</p>}

              {dashboardJobsError && <p>{dashboardJobsError}</p>}

              {!loadingDashboardJobs &&
                !dashboardJobsError &&
                filteredDashboardJobs.map((job) => (
                  <div
                    className="dashboard-job-card"
                    key={job.jobOfferId || job._id}
                  >
                    <span className="dashboard-job-title">
                      {job.title}
                    </span>

                    <div
                      className={`dashboard-job-status ${
                        job.status === "completed"
                          ? "done"
                          : job.status === "rejected"
                          ? "rejected"
                          : "in-progress"
                      }`}
                    >
                      {job.status === "completed"
                        ? "DONE"
                        : job.status === "rejected"
                        ? "REJECTED"
                        : "IN PROGRESS"}
                    </div>
                  </div>
                ))}

              {!loadingDashboardJobs &&
                !dashboardJobsError &&
                filteredDashboardJobs.length === 0 && (
                  <p>No jobs found.</p>
                )}
            </div>
          </div>

          {/* BEST PERFORMING MENTORS TITLE */}
          <h2 className="startup-best-mentors-title">
            Best Performing Mentors
          </h2>

          {/* BEST PERFORMING MENTORS CARDS */}
          <div className="startup-best-mentors-cards">
  {["first", "middle", "last"].map((position, index) => {
    const mentor = mentors[index];

    return (
      <div className={`startup-best-mentor-card ${position}`} key={position}>
        {mentor?.mentorPhoto ? (
          <img
            className="startup-best-mentor-photo"
            src={getPhotoUrl(mentor.mentorPhoto)}
            alt={mentor.username}
          />
        ) : (
          <div className="startup-best-mentor-photo startup-best-mentor-placeholder">
            {mentor?.username?.charAt(0).toUpperCase() || "M"}
          </div>
        )}

        <span className="startup-best-mentor-name">
          {mentor?.username || "Mentor Name"}
        </span>

        <span className="startup-best-mentor-jobs-count">
          0
        </span>

        <span className="startup-best-mentor-jobs-label">
          Achieved Jobs
        </span>

        <img
          className={`startup-best-mentor-arrow ${
            index === 0 ? "top-performer" : ""
          }`}
          src="/arrowspointingup.png"
          alt="Performance arrow"
        />
      </div>
    );
  })}
</div>

          {/* STARTUP COMPLETED JOBS STATISTICS */}
<div className="startup-performance-chart">
  <div className="startup-statistics-title">
    STATISTICS
  </div>

  <div className="startup-statistics-subtitle">
    Completed jobs over the year
  </div>

  {startupStatsError && (
    <p className="startup-statistics-error">
      {startupStatsError}
    </p>
  )}

  <LineChart
    width={508.619}
    height={177}
    className="startup-line-chart"
    data={startupCompletedStats}
    margin={{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }}
  >
    <XAxis
      dataKey="month"
      axisLine={{
        stroke: "#CBC6D7",
        strokeWidth: 0.99,
      }}
      tick={{
        fill: "#CBC6D7",
        fontFamily: "Inter",
        fontSize: 11.9,
        fontWeight: 500,
      }}
      tickLine={false}
    />

    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{
        fill: "#CBC6D7",
        fontFamily: "Inter",
        fontSize: 11.9,
        fontWeight: 500,
      }}
      tickCount={2}
      allowDecimals={false}
    />

    <CartesianGrid horizontal={false} vertical={false} />
    <Tooltip />

    <Line
      type="monotone"
      dataKey="count"
      stroke="#696CFF"
      strokeWidth={2.97}
      dot={false}
      activeDot={false}
    />
  </LineChart>
</div>
        </>
      )}

      {/* CREATE NEW JOB PAGE */}
      {activePage === "create-job" && (
        <section className="startup-create-job-page">
          <div className="startup-create-job-header">
            <h2>Create New Job</h2>

            <button
              type="button"
              className="startup-create-job-back"
              onClick={() => setActivePage("jobs")}
            >
              Back to Jobs
            </button>
          </div>

          <form
            className="startup-create-job-form"
            onSubmit={handleCreateJob}
          >
            <h3>Job Information</h3>

            <div className="startup-create-job-field">
              <label htmlFor="startup-job-title">Job Title</label>
              <input
                id="startup-job-title"
                type="text"
                placeholder="Enter job title"
                value={newJob.title}
                onChange={(event) =>
                  setNewJob({
                    ...newJob,
                    title: event.target.value,
                  })
                }
                required
                maxLength={120}
              />
            </div>

            <div className="startup-create-job-field">
              <label htmlFor="startup-job-category">Category</label>
              <select
                id="startup-job-category"
                value={newJob.category}
                onChange={(event) =>
                  setNewJob({
                    ...newJob,
                    category: event.target.value,
                  })
                }
                required
              >
                <option value="">Select category</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="product">Product</option>
                <option value="operations">Operations</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>

            <div className="startup-create-job-field">
              <label htmlFor="startup-job-description">
                Job Description
              </label>
              <textarea
                id="startup-job-description"
                placeholder="Describe the job and what you need help with..."
                value={newJob.description}
                onChange={(event) =>
                  setNewJob({
                    ...newJob,
                    description: event.target.value,
                  })
                }
                required
                rows={7}
              />
            </div>

            {createJobError && (
              <p className="startup-create-job-error">
                {createJobError}
              </p>
            )}

            <div className="startup-create-job-actions">
              <button
                type="button"
                className="startup-create-job-cancel"
                onClick={() => setActivePage("jobs")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="startup-create-job-submit"
                disabled={creatingJob}
              >
                {creatingJob ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STARTUP JOBS PAGE */}
      {activePage === "jobs" && (
        <section className="startup-job-feed">
          <div className="startup-job-feed-header">
            <h2>Your Startup Jobs</h2>

            <button
              className="startup-create-job-button"
              onClick={() => setActivePage("create-job")}
            >
              + Create New Job
            </button>
          </div>

          {loadingJobs && <p>Loading jobs...</p>}
          {jobsError && <p>{jobsError}</p>}

          {!loadingJobs && !jobsError && startupJobs.length === 0 && (
            <p>No jobs created yet.</p>
          )}

          <div className="mentor-job-feed-list">
            {startupJobs.map((job) => (
              <div className="mentor-feed-job-card" key={job._id}>
                <div className="mentor-feed-company">
                  <div className="mentor-feed-company-logo">
                    {job.companyPhoto ? (
                      <img
                        src={getPhotoUrl(job.companyPhoto)}
                        alt={job.companyName}
                      />
                    ) : (
                      <span>
                        {job.companyName?.charAt(0).toUpperCase() || "S"}
                      </span>
                    )}
                  </div>

                  <span>{job.companyName}</span>
                </div>

                <h3>{job.title}</h3>
                <p>{job.description}</p>

                <button onClick={() => setSelectedJob(job)}>
                  View More
                </button>
              </div>
            ))}
          </div>

          {selectedJob && (
            <div
              className="mentor-job-modal-overlay"
              onClick={() => setSelectedJob(null)}
            >
              <div
                className="mentor-job-modal"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="mentor-job-modal-close"
                  onClick={() => setSelectedJob(null)}
                >
                  ×
                </button>

                <div className="mentor-job-modal-company-info">
                  <div className="mentor-job-modal-logo">
                    {selectedJob.companyPhoto ? (
                      <img
                        src={getPhotoUrl(selectedJob.companyPhoto)}
                        alt=""
                      />
                    ) : (
                      <span>
                        {selectedJob.companyName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <span className="mentor-job-modal-company-name">
                    {selectedJob.companyName}
                  </span>
                </div>

                <h2>{selectedJob.title}</h2>
                <p className="mentor-job-modal-description">
                  {selectedJob.description}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* MENTORS PAGE - QUICK OVERVIEW */}
      {activePage === "mentors" && (
        <>
          <div className="mentor-quick-overview-title startup-quick-overview-title">
            Quick Overview
          </div>

          <div className="mentor-quick-overview startup-quick-overview">
            <button
              className={`quick-overview-card ${
                selectedOverview === "members" ? "selected" : ""
              }`}
              onClick={() => setSelectedOverview("members")}
            >
              <span>Total Members</span>
              <strong>{quickOverview.totalMembers}</strong>
            </button>

            <button
              className={`quick-overview-card ${
                selectedOverview === "assigned" ? "selected" : ""
              }`}
              onClick={() => setSelectedOverview("assigned")}
            >
              <span>Total Assigned Jobs</span>
              <strong>{quickOverview.totalAssignedJobs}</strong>
            </button>

            <button
              className={`quick-overview-card ${
                selectedOverview === "finished" ? "selected" : ""
              }`}
              onClick={() => setSelectedOverview("finished")}
            >
              <span>Finished Jobs</span>
              <strong>{quickOverview.finishedJobs}</strong>
            </button>
          </div>

          {overviewError && (
            <p className="startup-overview-error">
              {overviewError}
            </p>
          )}
        </>
      )}

      {/* MENTORS LIST */}
      {activePage === "mentors" && (
        <div className="startup-mentors-list">
          {loadingMentors && (
            <p className="startup-mentors-message">
              Loading mentors...
            </p>
          )}

          {mentorError && (
            <p className="startup-mentors-message">
              {mentorError}
            </p>
          )}

          {!loadingMentors &&
            !mentorError &&
            mentors.length === 0 && (
              <p className="startup-mentors-message">
                No registered mentors found.
              </p>
            )}

          {!loadingMentors &&
            !mentorError &&
            mentors.map((mentor) => {
              const rating = Math.max(
                0,
                Math.min(5, Number(mentor.mentorRating) || 0)
              );
              const roundedRating = Math.round(rating);
              const photoUrl = getPhotoUrl(mentor.mentorPhoto);

              return (
                <div
                  className="startup-mentor-card"
                  key={mentor._id}
                >
                  {photoUrl ? (
                    <img
                      className="startup-mentor-photo"
                      src={photoUrl}
                      alt={mentor.username}
                    />
                  ) : (
                    <div className="startup-mentor-photo-placeholder">
                      {mentor.username?.charAt(0).toUpperCase() || "M"}
                    </div>
                  )}

                  <div className="startup-mentor-info">
                    <div className="startup-mentor-heading">
                      <span className="startup-mentor-name">
                        {mentor.username}
                      </span>

                      {mentor.mentorLinkedin && (
                        <a
                          className="startup-mentor-linkedin"
                          href={mentor.mentorLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          in
                        </a>
                      )}
                    </div>

                    <div className="startup-mentor-rating">
                      <span className="startup-mentor-stars">
                        {"★".repeat(roundedRating)}
                        {"☆".repeat(5 - roundedRating)}
                      </span>

                      <span className="startup-mentor-rating-text">
                        {rating.toFixed(2)} average based on KPI
                        success rate.
                      </span>
                    </div>

                    <div className="startup-mentor-skills">
                      Skills:{" "}
                      {mentor.mentorSkills?.length > 0
                        ? mentor.mentorSkills.join(" | ")
                        : "Not added yet"}
                    </div>

                    <div className="startup-mentor-description">
                      {mentor.mentorDescription ||
                        "No description added yet."}
                    </div>
                  </div>

                  <button
                    className="startup-mentor-view-button"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setActivePage("view-mentor");
                    }}
                  >
                    View Mentor
                  </button>
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW INDIVIDUAL MENTOR */}
      {activePage === "view-mentor" && selectedMentor && (
        <div className="startup-view-mentor-page">
          <button
            className="startup-view-mentor-back"
            onClick={() => {
              setActivePage("mentors");
              setSelectedMentor(null);
            }}
          >
            ← Back to Mentors
          </button>

          <div className="startup-view-mentor-top">
            <div className="startup-view-mentor-profile">
              {selectedMentor.mentorPhoto ? (
                <img
                  className="startup-view-mentor-photo"
                  src={getPhotoUrl(selectedMentor.mentorPhoto)}
                  alt={selectedMentor.username}
                />
              ) : (
                <div className="startup-view-mentor-photo startup-view-mentor-placeholder">
                  {selectedMentor.username?.charAt(0).toUpperCase() || "M"}
                </div>
              )}

              <div className="startup-view-mentor-name-row">
                <h2>{selectedMentor.username}</h2>

                {selectedMentor.mentorLinkedin && (
                  <a
                    href={selectedMentor.mentorLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="startup-view-mentor-linkedin"
                  >
                    in
                  </a>
                )}
              </div>

              <p className="startup-view-mentor-role">
                {selectedMentor.mentorSkills?.[0] || "Mentor"}
              </p>

              <div className="startup-view-mentor-contact">
                <div>
                  <span>✉</span>
                  <span>
                    {selectedMentor.email || "No email available"}
                  </span>
                </div>

                <div>
                  <span>♧</span>
                  <span>
                    {selectedMentor.mentorPhone || "No phone available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="startup-view-mentor-about">
              <div className="startup-view-mentor-about-header">
                <h3>About Mentor</h3>

                <button
                  className="startup-view-mentor-offer-button"
                  onClick={handleOpenOfferModal}
                >
                  + Offer New Job
                </button>
              </div>

              <p className="startup-view-mentor-skills">
                <strong>Skills:</strong>{" "}
                {selectedMentor.mentorSkills?.length > 0
                  ? selectedMentor.mentorSkills.join(" | ")
                  : "Not added yet"}
              </p>

              <p className="startup-view-mentor-description">
                {selectedMentor.mentorDescription ||
                  "No description added yet."}
              </p>
            </div>
          </div>

          {/* MENTOR ASSIGNED JOBS */}
          <div className="startup-view-mentor-assigned">
            <h2>Assigned Jobs</h2>

            <div className="startup-view-mentor-job-tabs">
              {[
                ["all", "All"],
                ["completed", "Done"],
                ["rejected", "Rejected"],
                ["in_progress", "In Progress"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    assignedJobsFilter === value ? "active" : ""
                  }
                  onClick={() => setAssignedJobsFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="startup-view-mentor-assigned-list">
              {loadingAssignedJobs && (
                <p className="startup-view-mentor-empty">
                  Loading jobs...
                </p>
              )}

              {assignedJobsError && (
                <p className="startup-view-mentor-empty">
                  {assignedJobsError}
                </p>
              )}

              {!loadingAssignedJobs &&
                !assignedJobsError &&
                filteredMentorJobs.map((job) => (
                  <div
                    className="startup-view-mentor-assigned-row"
                    key={job._id}
                  >
                    <span className="startup-view-mentor-assigned-title">
                      {job.title}
                    </span>

                    <span
                      className={`startup-view-mentor-job-status ${job.status}`}
                    >
                      {job.status === "completed"
                        ? "DONE"
                        : job.status === "in_progress"
                        ? "IN PROGRESS"
                        : job.status === "canceled"
                        ? "CANCELED"
                        : "PENDING"}
                    </span>
                  </div>
                ))}

              {!loadingAssignedJobs &&
                !assignedJobsError &&
                filteredMentorJobs.length === 0 && (
                  <p className="startup-view-mentor-empty">
                    No jobs found.
                  </p>
                )}
            </div>
          </div>

          {/* PENDING JOB OFFERS */}
          <div className="startup-view-mentor-pending">
            <h2>Pending Job Offers</h2>

            <div className="startup-view-mentor-pending-list">
              {loadingPendingOffers && (
                <p className="startup-view-mentor-pending-message">
                  Loading offers...
                </p>
              )}

              {pendingOffersError && (
                <p className="startup-view-mentor-pending-message">
                  {pendingOffersError}
                </p>
              )}

              {!loadingPendingOffers &&
                !pendingOffersError &&
                mentorPendingOffers.length === 0 && (
                  <p className="startup-view-mentor-pending-message">
                    No pending job offers.
                  </p>
                )}

              {!loadingPendingOffers &&
                !pendingOffersError &&
                mentorPendingOffers.map((offer) => (
                  <div
                    className="startup-view-mentor-pending-card"
                    key={offer._id}
                  >
                    <span className="startup-view-mentor-pending-title">
                      {offer.jobTitle}
                    </span>

                    <button
                      type="button"
                      className="startup-view-mentor-cancel-offer"
                      onClick={() => handleCancelOffer(offer._id)}
                      disabled={cancelingOfferId === offer._id}
                    >
                      {cancelingOfferId === offer._id
                        ? "Canceling..."
                        : "Cancel Offer"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* OFFER NEW JOB MODAL */}
      {showOfferModal && selectedMentor && (
        <div
          className="startup-offer-modal-overlay"
          onClick={() => {
            if (!sendingOffer) setShowOfferModal(false);
          }}
        >
          <div
            className="startup-offer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="startup-offer-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="startup-offer-modal-header">
              <h2 id="startup-offer-modal-title">
                Offer New Job
              </h2>

              <button
                type="button"
                className="startup-offer-modal-close"
                disabled={sendingOffer}
                onClick={() => setShowOfferModal(false)}
              >
                ×
              </button>
            </div>

            <p className="startup-offer-modal-subtitle">
              Send a job offer to{" "}
              <strong>{selectedMentor.username}</strong>
            </p>

            <form onSubmit={handleSendJobOffer}>
              <div className="startup-offer-modal-field">
                <label htmlFor="startup-offer-job">
                  Select Job
                </label>

                <select
                  id="startup-offer-job"
                  value={selectedOfferJob}
                  onChange={(event) =>
                    setSelectedOfferJob(event.target.value)
                  }
                  required
                  disabled={
                    loadingOfferJobs ||
                    sendingOffer ||
                    !!offerSuccess
                  }
                >
                  <option value="">Choose a job</option>

                  {offerJobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOfferJob && (
                <div className="startup-offer-modal-description">
                  <h3>Job Description</h3>
                  <p>
                    {offerJobs.find(
                      (job) => job._id === selectedOfferJob
                    )?.description}
                  </p>
                </div>
              )}

              {loadingOfferJobs && (
                <p className="startup-offer-modal-message">
                  Loading jobs...
                </p>
              )}

              {!loadingOfferJobs &&
                !offerError &&
                offerJobs.length === 0 && (
                  <p className="startup-offer-modal-message">
                    You have no pending jobs available to offer.
                    Create a new job first.
                  </p>
                )}

              {offerError && (
                <p className="startup-offer-modal-error">
                  {offerError}
                </p>
              )}

              {offerSuccess && (
                <p className="startup-offer-modal-success">
                  {offerSuccess}
                </p>
              )}

              <div className="startup-offer-modal-actions">
                <button
                  type="button"
                  className="startup-offer-modal-cancel"
                  disabled={sendingOffer}
                  onClick={() => setShowOfferModal(false)}
                >
                  {offerSuccess ? "Close" : "Cancel"}
                </button>

                {!offerSuccess && (
                  <button
                    type="submit"
                    className="startup-offer-modal-submit"
                    disabled={
                      !selectedOfferJob ||
                      sendingOffer ||
                      loadingOfferJobs
                    }
                  >
                    {sendingOffer ? "Sending..." : "Send Offer"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default StartupDashboard;