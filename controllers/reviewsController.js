const express = require('express'),
  route = express.Router(),
  {catchError} = require('../handlers/handleError'),
  models = require('../models/models');

route.get('/', (req, res) => {
  const id = req.query.restaurant_id;
  if (id) {
    models.getRestaurantReviews(id)
      .then(response => response.rows)
      .then(restaurant => res.json(restaurant))
      .catch(catchError);
  }
  else {
    models.getAllReviews()
      .then(response => res.send(response.rows))
      .catch(catchError);
  }
})

route.get('/:id', (req, res) => {
  const { id } = req.params;
  models.getReview(id)
    .then(response => res.send(response.rows))
    .catch(catchError);
})

route.post('/', (req, res, next) => {
  const { ip } = req,
    { restaurant_id, name, rating, comments } = req.body;
  if (!restaurant_id || !name || !rating || !comments) {
    res.send('Form is not valid');
  }
  console.log('Request:',req.body)
  models.postReview(ip, restaurant_id, name, rating, comments)
    .then(response => {
      res.status(201).send(response)
    })
    .catch(error => console.error(error));
})

route.put('/:id', (req, res) => {
  const { ip } = req,
    { id } = req.params,
    { name, rating, comments } = req.body;
  
  models.modifyReview(ip, id, name, rating, comments)
    .then(response => res.send(response))
    .catch(catchError);
})

route.delete('/:id', (req, res) => {
  const { ip } = req,
    { id } = req.params;

  models.deleteReview(ip, id)
    .then(response => res.send(response))
    .catch(catchError);
})

module.exports = route;