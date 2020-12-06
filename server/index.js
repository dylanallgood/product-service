const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { router } = require('./routes/route');
const app = express();

mongoose
  .connect('mongodb://localhost/product-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(3000, () => console.log('listening on port 3000')))
  .then(console.log('connected to db'))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
