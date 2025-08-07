const express = require ("express")
const {createTrip,getTrip,getSingleTrip,updateTrip,deleteTrip} = require ("../controllers/trip")
const tripRouter = express.Router()

tripRouter.post("/",createTrip)
tripRouter.get("/",getTrip)
tripRouter.get("/:id",getSingleTrip)
tripRouter.patch("/:id",updateTrip)
tripRouter.delete("/:id",deleteTrip)

module.exports = tripRouter