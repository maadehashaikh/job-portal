import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registering a new user
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    // check kar rhy hain kay yeh email registered to nh  ?
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already access with this email",
        success: false,
      });
    }
    // hash kar rhy hain password ko
    const hashedPassword = await bcrypt.hash(password, 10);

    // now creating user and password will save in database (password as hashed password)
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: "",
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // checking that email, password and role is not missing
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    // checking that email exists in database or not !
    let user = await User.findOne({ email });
    // console.log(`pehly wala user${user}`);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }
    // matching password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    // here password is the password which is given by user and user.password is the password which is save in database now we are comparing both then we'll login user
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    // checking the role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "This account doesn't exist with current role",
        success: false,
      });
    }

    // generating tokens
    const tokenData = {
      userId: user._id, // Payload for the JWT: contains the user's ID
    };

    // Create a JWT with the payload, signed using the secret key, and set to expire in 1 day
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Restructure the user object to send only necessary data to the client
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    // Send the token in a cookie and the user data in the response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // Cookie expires in 1 day (matches JWT expiration)
        httpsOnly: true, // Cookie is accessible only by the server (not by client-side JavaScript)
        // sameSite: strict, // Cookie is sent only for same-site requests
      })
      .json({
        message: `Welcome back ! ${user.fullname}`,
        success: true,
        token,
      });
  } catch (error) {
    return console.log(error);
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Logout error as : ${error}`);
    return res.status(500).json({
      message: "Internal server error during logout",
      success: false,
      error: error.message, // Optionally include the error message
    });
  }
};

// updateProfile

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, role } = req.body;
    const file = req.file;
    // cloudnary will come here

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userid = req.id; // user id is coming from the middleware authentication
    let user = await User.findById(userid);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (skills) user.skills = skillsArray;
    if (role) user.role = role;

    // resume will come here later
    await user.save();
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      skills: skillsArray,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(`Logout error as : ${error}`);
    return res.status(500).json({
      message: "Internal server error during logout",
      success: false,
      error: error.message, // Optionally include the error message
    });
  }
};
