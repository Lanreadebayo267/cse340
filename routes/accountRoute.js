const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Account management view (default account route)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
)

// Deliver update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
})

// Process account info update
router.post(
  "/update-account",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update-password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router