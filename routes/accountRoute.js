const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Login view
router.get(
  "/",
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
  utilities.handleErrors(accountController.accountLogin)
)

// Process registration
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router