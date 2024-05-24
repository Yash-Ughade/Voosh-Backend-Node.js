const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: String,
  photo: String,
  bio: String,
  phone: String,
  isAdmin: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  socialId: String,
  provider: String,
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
