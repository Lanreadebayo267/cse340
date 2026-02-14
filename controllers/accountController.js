const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************************
* Deliver login view
* ************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash("notice")
  })
}

/* ***************************************
* Deliver registration view
* ************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
* Process registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
    title: "Login",
    nav,
    messages: req.flash("notice")
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    console.log("Entered password:", account_password)
    console.log("Stored hash:", accountData.account_password)
    if (await bcrypt.compare(account_password, accountData.account_password)) {
  console.log("LOGIN SUCCESS")
  delete accountData.account_password

  const accessToken = jwt.sign(
    accountData,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  )

  res.cookie("jwt", accessToken, { httpOnly: true })

  return res.redirect("/account")
}

    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      console.log("Password DID NOT MATCH")
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 * Build account management view
 * ************************************* */
async function buildAccount(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null,
    accountData
  })
}

async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    messages: req.flash("notice"),
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account successfully updated.")
    return res.redirect(`/account/update/${account_id}`)
  } else {
    req.flash("notice", "Sorry, the update failed.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      messages: req.flash("notice"),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Error processing password update.")
    return res.redirect(`/account/update/${account_id}`)
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash("notice", "Password successfully updated.")
  } else {
    req.flash("notice", "Password update failed.")
  }

  return res.redirect(`/account/update/${account_id}`)
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccount,
    buildUpdateAccount,
    updateAccount,
    updatePassword,
}