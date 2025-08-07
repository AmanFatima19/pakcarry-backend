const express = require("express")
const{createContact,getContacts} = require("../controllers/contact")
const router = express.Router()

router.post("/",createContact)
router.get("/",getContacts)

module.exports = router