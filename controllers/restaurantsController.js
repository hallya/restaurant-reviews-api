const express = require('express'),
  route = express.Router(),
  handleError = require('../handlers/handleError');
  models = require('../models/models');

route.get('/', (req, res) => {
  models.getAllRestaurants()
    .then(response => res.send(response.rows))
    .catch(handleError);
})

route.get('/:id', (req, res) => {
  const { id } = req.params;

  models.getRestaurant(id)
    .then(response => res.json(response.rows[0]))
    .catch(handleError);
})

route.put('/:id/', (req, res) => {
  const { id } = req.params,
    { is_favorite } = req.query;

  models.setFavorite(id, is_favorite)
    .then(response => res.json(response))
    .catch(handleError);
})

module.exports = route;