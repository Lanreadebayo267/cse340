const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

utilities.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid += '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += "<li>"
      grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' 
        + vehicle.inv_make + " " + vehicle.inv_model + ' details">'
      grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ' 
        + vehicle.inv_make + " " + vehicle.inv_model + ' on CSE Motors">'
      grid += "</a>"
      grid += "<div class='namePrice'>"
      grid += "<hr>"
      grid += "<h2>"
      grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' 
        + vehicle.inv_make + " " + vehicle.inv_model + ' details">'
        + vehicle.inv_make + " " + vehicle.inv_model + "</a>"
      grid += "</h2>"
      grid += "<span>$"
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
        + "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid += "<p class='notice'>Sorry, no matching vehicles could be found.</p>"
  }

  return grid
}

utilities.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt
  console.log("Incoming JWT:", token)

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        console.log("JWT verification failed:", err.message)
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      console.log("JWT verified:", accountData)
      res.locals.accountData = accountData
      res.locals.loggedin = true
      next()
    })
  } else {
    console.log("No JWT cookie found")
    res.locals.loggedin = false
    next()
  }
}

utilities.checkEmployeeOrAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    // User is allowed
    return next()
  }

  // User not allowed
  req.flash("notice", "You must be logged in as an employee or admin to access this page.")
  return res.redirect("/account/login")
}

/* ****************************************
 * Check Login
 * ************************************* */
 utilities.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
module.exports = utilities