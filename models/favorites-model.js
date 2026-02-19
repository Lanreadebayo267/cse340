const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    console.error("addFavorite error:", error)
    throw error
  }
}

async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id, i.*
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.date_added DESC;
    `
    return await pool.query(sql, [account_id])
  } catch (error) {
    console.error("getFavorites error:", error)
    throw error
  }
}

async function removeFavorite(favorite_id) {
  try {
    const sql = `DELETE FROM favorites WHERE favorite_id = $1`
    return await pool.query(sql, [favorite_id])
  } catch (error) {
    console.error("removeFavorite error:", error)
    throw error
  }
}

module.exports = {
  addFavorite,
  getFavoritesByAccount,
  removeFavorite
}