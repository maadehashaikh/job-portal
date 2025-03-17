import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id; // const {id:jobId} = req.params
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }
    // checking user has applied already ?
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      res.status(400).json({
        message: "You've already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ message: "OOps! Job not found", success: false });
    }

    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Job applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Error Found at applying job ${error}`);
    return res.status(500).json({
      message: "Internal server error during apply job",
      success: false,
      error: error.message,
    });
  }
};

// all the applied jobs ko get karna h
export const getappliedjobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });

    if (!application) {
      res.status(400).json({
        message: "No application found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched all the applied jobs",
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error during getting applied jobs",
      success: false,
      error: error.message,
    });
  }
};

// admin can check kitny applicants ny apply kia h
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
      message: "Applicants fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error during getting applicants",
      success: false,
      error: error.message,
    });
  }
};

// status updating api
export const updatestatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicantionId = req.params.id;
    if (!status) {
      return res.status(400).josn({
        message: "Status is required",
        success: false,
      });
    }
    // find the application by applicationid
    const application = await Application.findOne({ _id: applicantionId });
    if (!application) {
      res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }
    // updating the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Updated status successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error during getting applicants",
      success: false,
      error: error.message,
    });
  }
};
