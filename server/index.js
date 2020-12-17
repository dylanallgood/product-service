const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { router } = require('./routes/route');
const { uri } = require('./auth/credentials');

const app = express();

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/loaderio-fd23892f9504445832194bba0a89c342/', (req, res) => {
  res.status(200).send('loaderio-fd23892f9504445832194bba0a89c342');
});

app.use('/', router);
