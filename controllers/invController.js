const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* Build inventory by classification view */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()

    let grid = "<p>No vehicles found for this classification.</p>"
    if (data && data.length > 0) {
      grid = await utilities.buildClassificationGrid(data)
    }

    const className = data.length > 0 ? data[0].classification_name : "No Vehicles Found"

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

/* Build inventory detail view */
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const vehicle = await invModel.getInventoryById(inv_id)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const nav = await utilities.getNav()
    const vehicleHTML = utilities.buildVehicleDetail(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML
    })
  } catch (err) {
    next(err)
  }
}

/* Inventory Management view */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const message = req.flash("message") || ""
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message
    })
  } catch (err) {
    next(err)
  }
}

/* Show Add Classification Form */
invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const message = req.flash("message") || ""
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message
    })
  } catch (err) {
    next(err)
  }
}

/* Process Add Classification */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body

    if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
      req.flash("message", "Classification name can only contain letters and numbers")
      return res.redirect("/inv/add-classification")
    }

    const result = await invModel.addClassification(classification_name)
    if (result.rowCount > 0) {
      req.flash("message", `Successfully added classification: ${classification_name}`)
      return res.redirect("/inv/")
    } else {
      req.flash("message", "Failed to add classification")
      return res.redirect("/inv/add-classification")
    }
  } catch (err) {
    next(err)
  }
}

/* Show Add Inventory Form */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classifications = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classifications,
      errors: null
    })
  } catch (err) {
    next(err)
  }
}

/* Process Add Inventory Form */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body

    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )

    if (result) {
      req.flash("message", "Inventory item added successfully")
      res.redirect("/inv/")
    } else {
      req.flash("message", "Failed to add inventory item")
      res.redirect("/inv/add-inventory")
    }
  } catch (err) {
    next(err)
  }
}

/* Build delete confirmation view */
invCont.buildDeleteConfirm = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()

    const vehicle = await invModel.getInventoryById(inv_id)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    res.render("inventory/delete-confirm", {
      title: `Delete ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      errors: null,
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price
    })
  } catch (err) {
    next(err)
  }
}

/* Process delete inventory item */
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    const result = await invModel.deleteInventoryItem(inv_id)

    if (result && result.rowCount > 0) {
      req.flash("message", "Inventory item deleted successfully")
      res.redirect("/inv/")
    } else {
      req.flash("message", "Delete failed. Please try again.")
      res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = invCont