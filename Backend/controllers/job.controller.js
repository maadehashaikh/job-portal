import { Job } from "../models/job.model.js";

// admin job post karyy ga
export const postjob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      experience,
      companyId,
    } = req.body;

    const userId = req.id;
    // console.log(`userId  is : ${userId}`);
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !experience ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Kindly fill all the fileds",
        success: false,
      });
    }

    // create karny say phly we want kay jo bh banda job create kar rha h uska role recruiter he h ya nh !!!

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map((req) => req.trim()),
      salary: Number(salary),
      location,
      jobType,
      position,
      experienceLevel: experience,
      company: companyId,
      created_by: userId, // role recruiter h ya nh
    });
    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(`Job posting error : ${error}`);
    return res.status(500).json({
      message: "Internal server error during job posting",
      success: false,
      error: error.message,
    });
  }
};

// user ya student kay liyay
export const getAllJobs = async (req, res) => {
  try {
    // doing filtering !
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Fetched your desired jobs. ",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(`geting all jobs error as : ${error}`);
    return res.status(500).json({
      message: "Internal server error during geting all jobs error",
      success: false,
      error: error.message,
    });
  }
};

// user ya student kay liyay
export const getJobsByID = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job found successfully.",
      success: false,
      job,
    });
  } catch (error) {
    console.log(`get jobs by ID error as : ${error}`);
    return res.status(500).json({
      message: "Internal server error during get jobs by ID",
      success: false,
      error: error.message,
    });
  }
};

// how many jobs created by which admin
export const jobsCreatedByAdmin = async (req, res) => {
  try {
    const adminId = req.id;
    const jobsCreatedByAdmin = await Job.find({ created_by: adminId });
    if (!jobsCreatedByAdmin) {
      return res.status(404).json({
        message: "No jobs found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched all the jobs",
      success: true,
      jobsCreatedByAdmin,
    });
  } catch (error) {
    console.log(`error as : ${error}`);
    return res.status(500).json({
      message: "Internal server error during jobs created by admin",
      success: false,
      error: error.message,
    });
  }
};
