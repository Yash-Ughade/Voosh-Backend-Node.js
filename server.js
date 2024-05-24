const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('./passport/passport-config');
let passport = require('passport');
require('./passport/passport-config');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api',authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(5000);
}) .catch(err => {
  console.log(err);

});



