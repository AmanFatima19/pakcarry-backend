const feedbackModel = require("../models/feedback");

const createFeedback = async (req, res) => {

  try {
    const { name, email, feedback, rating } = req.body;

    // if (!name || !email || !feedback || rating == null) {
    //   return res.status(400).json({ msg: "All fields are required" });
    // }

    const newFeedback = new feedbackModel({ name, email, feedback, rating });
    await newFeedback.save();

    res.status(200).json({ msg: "Feedback submitted successfully" });
  } catch (err) {
    // console.error("Error creating feedback:", err);
    res.status(500).json({ msg: "Server Error, please try again later" });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ msg: "Unable to fetch feedback messages" });
  }
};

module.exports = { createFeedback, getFeedback };
