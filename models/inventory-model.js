const pool = require("../database/")

const invModel = {}

/* Get all classifications */
invModel.getClassifications = async function () {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows // return array
  } catch (error) {
    console.error("getClassifications error: ", error)
    throw error
  }
}

/* Get inventory items by classification */
invModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: ", error)
    throw error
  }
}

/* Get single inventory item */
invModel.getInventoryById = async function (inv_id) {
  try {
    const sql = `SELECT * FROM inventory WHERE inv_id = $1`
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error: ", error)
    throw error
  }
}

/* Add classification */
invModel.addClassification = async function (classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1)`
    const result = await pool.query(sql, [classification_name])
    return result
  } catch (error) {
    console.error("addClassification error: ", error)
    throw error
  }
}

/* Add inventory item */
invModel.addInventory = async function (
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const data = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}

module.exports = invModel