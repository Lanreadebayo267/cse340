const favoritesModel = require("../models/favorites-model")

async function buildFavoritesView(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const data = await favoritesModel.getFavoritesByAccount(account_id)

    res.render("account/favorites", {
      title: "My Favorites",
      favorites: data.rows
    })
  } catch (error) {
    next(error)
  }
}

async function addFavorite(req, res, next) {
  try {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    await favoritesModel.addFavorite(account_id, inv_id)
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

async function removeFavorite(req, res, next) {
  try {
    const { favorite_id } = req.body
    await favoritesModel.removeFavorite(favorite_id)
    res.redirect("/account/favorites")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildFavoritesView,
  addFavorite,
  removeFavorite
}
