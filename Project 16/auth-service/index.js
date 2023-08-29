const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./User');

mongoose
  .connect('mongodb://127.0.0.1:27017/auth-service')
  .then(() => console.log('Auth-Service DB Connected!'));

const app = express();
app.use(express.json());

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User doesn't exist" });
  } else {
    if (password !== user.password) {
      return res.json({ message: 'Password Incorrect' });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, 'secret', (err, token) => {
      if (err) console.log(err);
      else return res.json({ token: token });
    });
  }
});

app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: 'User already exists' });
  } else {
    const newUser = new User({
      email,
      name,
      password,
    });
    newUser.save();
    return res.json(newUser);
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth-Service at ${PORT}`);
});
