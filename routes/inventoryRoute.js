// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Adding Detail Route
router.get(
    "/detail/:inv_id",
    utilities.handleErrors(invController.buildInventoryDetail)
)

// Intentional error route
router.get("/trigger-error", (req, res, next) => {
  // This will intentionally throw an error
  next(new Error("This is a forced 500 error for testing"))
})

module.exports = router;