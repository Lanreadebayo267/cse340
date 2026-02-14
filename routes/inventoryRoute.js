const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Inventory Management
router.get(
  "/management",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.buildManagementView
)

// Classification
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.buildAddClassificationView
)
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.addClassification
)

// Vehicle
router.get(
  "/add-vehicle",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.buildAddInventory
)
router.post(
  "/add-vehicle",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.addInventory
)
router.get(
  "/delete-vehicle/:inv_id",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.buildDeleteConfirm
)
router.post(
  "/delete-vehicle",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invController.deleteInventoryItem
)

module.exports = router