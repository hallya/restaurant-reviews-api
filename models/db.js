const { Client } = require('pg'),
  client = new Client({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'restaurantdb',
    port: '5432'
  });

client.connect()
  .then(() => console.log('DB connected'))
  .catch(error => console.log('Error :', error));

module.exports = client;