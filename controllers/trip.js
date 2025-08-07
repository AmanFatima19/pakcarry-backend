const tripModel = require("../models/newTrip");

const createTrip = async (req, res) => {
  try {
    const { from, to, date, space, description, agree } = req.body;

    if (!agree) {
      res.status(400).json({ msg: "You must agree to terms" });
      return;
    }

    const newTrip = new tripModel({ from, to, date, space, description, agree });
    await newTrip.save();

    res.status(200).json({ msg: "Trip created successfully", trip: newTrip });
  } catch (err) {
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const getTrip = async (req, res) => {
  try {
    const trips = await tripModel.find().sort({ createdAt: 1 });
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ msg: "Unable to fetch trips" });
  }
};

const getSingleTrip = async (req, res) => {
  try {
    const singleTrip = await tripModel.findById(req.params.id);
    if (!singleTrip) {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(200).json(singleTrip);
  } catch (err) {
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const updateTrip = async (req, res) => {
  try {
    const updatedTrip = await tripModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, 
    });

    if (!updatedTrip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    res.status(200).json({ msg: "Trip details updated successfully", trip: updatedTrip });
  } catch (err) {
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await tripModel.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(200).json({ msg: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

module.exports = {
  createTrip,
  getTrip,
  getSingleTrip,
  updateTrip,
  deleteTrip,
};
