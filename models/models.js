const db = require('./db'),
  {catchError} = require('../handlers/handleError');

function checkReviews(ip, restaurant_id, name) {
  return db.query(`select * from reviews where reviews.ip='${ip}' and reviews.restaurant_id=${restaurant_id} and reviews.name='${name}'`)
    .catch(catchError)
}

function getAllRestaurants() {
  return db.query('select * from restaurants')
    .catch(catchError);
}

function getAllReviews() {
  return db.query('select * from reviews')
    .catch(catchError);
}

function getRestaurant(restaurant_id) {
  return db.query(`select * from restaurants where restaurants.id=${restaurant_id}`)
    .catch(catchError);
}

function getReview(review_id) {
  return db.query(`select * from reviews where reviews.id=${review_id}`)
    .catch(catchError);
}

function getAverageNotes() {
  return db.query(`select restaurants.id, restaurants.name, AVG(rating)  from restaurants join reviews on reviews.restaurant_id=restaurants.id group by restaurants.id`)
    .catch(catchError);
}

function getRestaurantsAndReviews() {
  return db.query(`select restaurants.id, restaurants.name, ROUND(AVG(rating),1) as average_rating, address, cuisine_type, neighborhood, photograph,  latlng, operating_hours,
    JSON_AGG(JSON_BUILD_OBJECT(
      'id', reviews.id,
      'name', reviews.name,
      'ip', reviews.ip,
      'rating', reviews.rating,
      'createdAt', reviews.createdAt,
      'updatedAt', reviews.updatedAt,
      'comments', reviews.comments)) as reviews
  FROM restaurants
  JOIN reviews on reviews.restaurant_id=restaurants.id
  GROUP BY restaurants.id`)
}

function getRestaurantReviews(restaurant_id) {
  return db.query(`select * from reviews where restaurant_id=${restaurant_id}`)
}

async function postReview(ip, restaurant_id, name, rating, comments) {
  const alreadyPostReview = await checkReviews(ip, restaurant_id, name);
  if (alreadyPostReview.rows.length) {
    console.log('Review already posted');
    return Promise.reject('You already post this review');
  } else {
    console.log('New review !');
    return db.query(
      `insert into reviews (name, ip, "createdAt", "updatedAt", rating, comments, restaurant_id)
      values ('${name}', '${ip}', ${Date.now()}, ${Date.now()}, ${rating}, '${comments}', ${restaurant_id});`
    )
  }
}

async function modifyReview(ip, review_id, name, rating, comments, updatedAt = Date.now()) {
  const result = await getReview(review_id);
  if (result.rows[0] && result.rows[0].ip === ip) {
    console.log(`update reviews set updatedAt=${updatedAt}, name='${name}', rating=${rating}, comments='${comments}' where reviews.id=${review_id}`)
    return await db.query(`update reviews set updatedAt=${updatedAt}, name='${name}', rating=${rating}, comments='${comments}' where reviews.id=${review_id}`)
      .catch(catchError);
  }
  else {
    return Promise.reject('You are not allowed to modify this review');
  }
}

async function setFavorite(id, is_favorite) {
  return await db.query(`update restaurants set is_favorite=${is_favorite} where restaurants.id=${id}`)
    .catch(catchError);
}

async function deleteReview(ip, review_id) {
  const review = await getReview(review_id);
  if (review.rows[0].ip === ip) {
    return await db.query(`delete from reviews where id=${review_id}`);
  }
  else {
    return Promise.reject('You don\'t have the permissions to delete this review');
  }
}

module.exports = {
  getAllRestaurants,
  getAllReviews,
  getRestaurant,
  getReview,
  getAverageNotes,
  getRestaurantReviews,
  getRestaurantsAndReviews,
  postReview,
  modifyReview,
  deleteReview,
  setFavorite
}