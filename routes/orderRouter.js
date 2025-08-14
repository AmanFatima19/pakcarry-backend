import express from "express";
import multer from "multer";
import { createOrder, getOrders } from "../controllers/ordercontroller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/", upload.array("images", 5), createOrder);
router.get("/", getOrders);

export default router;
