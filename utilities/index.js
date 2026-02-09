const invModel = require("../models/inventory-model")

const utilities = {}

/* Build classification dropdown list */
utilities.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  const rows = data?.rows || data || [] // ensure rows is always an array

  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}

/* Build nav */
utilities.getNav = async function () {
  const data = await invModel.getClassifications()
  const rows = data?.rows || data || []

  let nav = "<ul>"
  rows.forEach((row) => {
    nav += `<li><a href='/inv/type/${row.classification_id}'>${row.classification_name}</a></li>`
  })
  nav += "</ul>"
  return nav
}

/* ***************************
 * Async error handler wrapper
 * Wrap async route handlers so errors go to Express error handler
 ***************************/
utilities.handleErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

utilities.buildClassificationGrid = function(data) {
  if (!data || data.length === 0) return "<p>No vehicles to display.</p>"

  let grid = "<ul class='vehicle-grid'>"
  data.forEach(vehicle => {
    grid += `<li>${vehicle.inv_make} ${vehicle.inv_model} - $${vehicle.inv_price}</li>`
  })
  grid += "</ul>"
  return grid
}

module.exports = utilities