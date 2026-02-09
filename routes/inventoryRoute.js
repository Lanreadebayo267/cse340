const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Inventory routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildInventoryDetail))

// Management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))
router.post("/add-classification", utilities.handleErrors(invController.addClassification))

// Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", utilities.handleErrors(invController.addInventory))

module.exports = router