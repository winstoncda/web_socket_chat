import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  console.log(req.body);

  const { fullName, email, password } = req.body;
  try {
    if (password.length < 5) {
      return res.status(400).json({
        message: "Le mot de passe doit faire au moins 6 caractères",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email déjà présent en base de données",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profileAvatar: newUser.profileAvatar,
      });
    } else {
      return res.status(400).json({
        message: "Données utilisateur invalides",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Données utilisateur invalides",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Données utilisateur invalides",
      });
    }
    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileAvatar: user.profileAvatar,
    });
  } catch (error) {
    console.log("Error in login controller", error);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.log("Error in logout controller", error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profileAvatar } = req.body;
    const userId = req.user._id;

    if (!profileAvatar) {
      return res.status(400).json({
        message: "L'avatar est requis",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profileAvatar);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileAvatar: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile", error);
  }
};

export const checkAuthentification = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in check auth", error);
  }
};
