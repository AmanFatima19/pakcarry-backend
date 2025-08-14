const express = require("express")
const {createFeedback , getFeedback} = require("../controllers/feedback")
const feedbackRouter = express.Router()

feedbackRouter.post("/",createFeedback)
feedbackRouter.get("/",getFeedback)

module.exports = feedbackRouter