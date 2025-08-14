import Order from "../models/order.js";


export const createOrder = async (req, res) => {
  try {
    const { earliestDate, lastDate, from, to, weight, description } = req.body;
    const errors = {};

    // Manual validation
    if (!earliestDate) errors.earliestDate = "Please select the earliest delivery date";
    if (!lastDate) errors.lastDate = "Please select the last delivery date";
    if (!from) errors.from = "Please enter the origin city";
    if (!to) errors.to = "Please enter the destination city";
    if (!weight) errors.weight = "Please enter the package weight";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const imagePaths = req.files?.map(file => file.filename) || [];

    const order = new Order({
      earliestDate,
      lastDate,
      from,
      to,
      weight,
      description,
      images: imagePaths
    });

    await order.save();

    res.json({ message: "Order created successfully", order });

  } catch (err) {
    if (err.name === "ValidationError") {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors });
    }

    res.status(500).json({ message: "Error creating order", error: err.message });
  }
};


export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { earliestDate, lastDate, from, to, weight, description } = req.body;
    const errors = {};

    if (!earliestDate) errors.earliestDate = "Please select the earliest delivery date";
    if (!lastDate) errors.lastDate = "Please select the last delivery date";
    if (!from) errors.from = "Please enter the origin city";
    if (!to) errors.to = "Please enter the destination city";
    if (!weight) errors.weight = "Please enter the package weight";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const imagePaths = req.files?.map(file => file.filename) || [];

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        earliestDate,
        lastDate,
        from,
        to,
        weight,
        description,
        ...(imagePaths.length > 0 && { images: imagePaths })
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
};
