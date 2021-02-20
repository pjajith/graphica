const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/keys');

const signToken = ({ id }) => {
  return jwt.sign({
    sub: id,
    iss: 'Graphica',
    iat: new Date().getTime()
  }, jwtSecret, {
    expiresIn: '24h'
  });
}

module.exports = {
  signup: async (req,res) => {
    try {
      const { email, password } = req.body;

      const findUser = await User.findOne({ "auth.email": email });

      if(findUser) {
        return res.status(400).json({ err: 'Email is already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        config: {
          method: 'local'
        },
        auth: {
          email,
          local: {
            password: hashedPassword
          }
        }
      });

      await user.save();

      // generate token
      const token = signToken(user);

      const userDetails = {
        config: user.config,
        auth: {
          email: user.auth.email
        },
        id: user._id
      }

      res.status(201).json({ token, user: userDetails });

    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Server error" });
    }
  },
  login: async (req,res) => {
    try {
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Server error" });
    }
  }
}