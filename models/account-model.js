// account-model.js
const pool = require("../database/")  // <-- fix: assign require to 'pool'

/* ******************************
*   Register new account
* **************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = `
            INSERT INTO account 
            (account_firstname, account_lastname, account_email, account_password, account_type) 
            VALUES ($1, $2, $3, $4, 'Client') 
            RETURNING *
        `
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]) 
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Get account by email
* *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    return null
  }
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

async function getAccountById(account_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    )
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_firstname, account_lastname, account_email } = req.body

  // Check if email already exists (for another account)
  const emailExists = await accountModel.getAccountByEmail(account_email)

  if (emailExists && emailExists.account_id != account_id) {
    req.flash("notice", "That email already exists. Please use a different one.")
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

async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    return await pool.query(sql, [hashedPassword, account_id])
  } catch (error) {
    console.error("updatePassword error: " + error)
    return false
  }
}

module.exports = {
    registerAccount,
    getAccountByEmail,
    checkExistingEmail,
    getAccountById,
    updateAccount,
    updatePassword,
}