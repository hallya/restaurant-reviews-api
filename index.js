const express = require('express'),
  server = express(),
  port = process.env.port || 3000,
  restaurants = require('./controllers/restaurantsController'),
  reviews = require('./controllers/reviewsController'),
  cors = require('cors');

server.use(express.json());
server.use(cors());
server.use("/restaurants", restaurants);
server.use("/reviews", reviews);

server.listen(port, () => console.log("Server run on port", port))
