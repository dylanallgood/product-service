const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { router } = require('./routes/route');
const { username, pass } = require('./auth/credentials');

const app = express();

mongoose
  .connect(
    `mongodb://${username}:${pass}@ec2-13-59-225-130.us-east-2.compute.amazonaws.com/product-service?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => app.listen(8080, () => console.log('listening on port 8080')))
  .then(console.log('connected to db'))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
