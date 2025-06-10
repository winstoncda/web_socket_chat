import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(400).json({
        message: "Interdit ! Pas de token",
      });
    }

    const decodedToken = jsonwebtoken.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      return res.status(400).json({
        message: "Interdit ! Token invalide",
      });
    }

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "Utilisateur inconnu",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in protect route middleware", error);
  }
};
