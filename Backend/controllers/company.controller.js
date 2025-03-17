import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyname, description, website, location } = req.body;
    if (!companyname || !description || !website || !location) {
      return res.status(400).json({
        message: "All fileds are required !",
        success: false,
      });
    }
    let company = await Company.findOne({ companyname: companyname });
    if (company) {
      return res.status(400).json({
        message: "OOps ! this company name is already registered.",
        success: false,
      });
    }
    company = await Company.create({
      companyname: companyname,
      userId: req.id,
      description: description,
      website: website,
      location: location,
    });

    return res.status(201).json({
      message: "Company regsitered successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Optional: Include error details for debugging
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies || companies.length === 0) {
      return res.status(400).json({
        message: "Companies not found !",
        success: false,
      });
    }

    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.log(`getCompany error : ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Optional: Include error details for debugging
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({
        message: "Company not found !",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(`getCompanyById error : ${error}`);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file; // from cloudnary
    const updatedata = {
      name,
      description,
      website,
      location,
    };
    const company = await Company.findByIdAndUpdate(req.params.id, updatedata, {
      new: true,
    });

    if (!company) {
      return res.status(401).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company info has updated ",
      success: true,
      company,
    });
  } catch (error) {
    console.log(`updatecompany error ${error}`);
  }
};
