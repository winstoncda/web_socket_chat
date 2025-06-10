import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersforSidebar = async (req, res) => {
  try {
    const loggedInId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInId } }).select(
      "-password"
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in get users for sidebar", error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverUserId },
        { senderId: receiverUserId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in get all messages", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverUserId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: receiverUserId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in send a message", error);
  }
};
