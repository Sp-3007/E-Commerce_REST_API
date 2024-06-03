const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../routes/user");

exports.user_post = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        res.status(409).json({
          message: "User already exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  message: "user created",
                  userID: result._id,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.user_get = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({ Message: "Auth faild user not exist" });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({ Message: "Auth faild" });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userID: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" } // 20 minutes
          );

          return res.status(200).json({
            Message: "User loged in",
            Token: token,
          });
        }
        res.status(401).json({ Message: "Auth faild" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({ Message: "Auth faild" });
    });
};

exports.user_delete = (req, res, next) => {
  const id = req.params.userID;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        Message: `User with ID ${id} is removed`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Message: "User still Exist" });
    });
};
