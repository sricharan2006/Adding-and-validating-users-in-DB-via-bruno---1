const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./models/user")

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(express.static('static'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection done'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post("/signup", async(req, res) => {
  const {username, email, password} = req.body;

  if(!username||!email||!password) {
    return res.status(400).json({message: "All feilds are required"})
  }

  try{
    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.json({message: "User created"});
  }
  catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ message: 'Server error' });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
