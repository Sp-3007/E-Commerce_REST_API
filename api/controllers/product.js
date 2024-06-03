
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.product_post = (req, res, next) => {
  // creating new product for mongo db entry
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Data saved successfully",
        product: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          Request: {
            type: "GET",
            url: "http://localhost:3000/product/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_get = (req, res, next) => {
  Product.find()
    .select("name price productImage _id")
    .then((docs) => {
      if (docs.length > 0) {
        const Result = {
          count: docs.length,
          items: docs.map((doc) => {
            return {
              _id: doc._id,
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              request: {
                type: "GET",
                url: "http://localhost:3000/product/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(Result);
      } else {
        res.status(200).json({
          message: "NO record",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.product_get = (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select("name price productImage _id")
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            message: "to go to all product hit this url",
            url: "http://localhost:3000/product",
          },
        });
      } else {
        res.status(404).json({ message: "No Such id found in database" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_patch = (req, res, next) => {
  const id = req.params.productID;
  const arr = req.body;
  Product.updateOne({ _id: id }, { $set: arr })
    .exec()
    .then((result) => {
      if (result.acknowledged) {
        if (result.matchedCount === 0) {
          res
            .status(404)
            .send({ message: `No such product with ID ${id} in the database` });
        } else if (result.modifiedCount === 0) {
          res
            .status(200)
            .send({ message: `Existing and new data is same with ID ${id}` });
        } else {
          console.log(result);
          res.status(200).json({
            message: `Product with ID ${id} has been updated successfully`,
            product: {
              request: {
                type: "GET",
                url: `http://localhost:3000/product/${id}`,
              },
            },
          });
        }
      } else {
        res.status(500).send({
          message: "Update operation was not acknowledged by the database",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

exports.product_delete = (req, res, next) => {
  const id = req.params.productID;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        Message: `Product with ID ${id} is removed`,
        request: {
          message: "To create new product go to this url",
          type: "POST",
          url: "http://localhost:3000/product",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ Message: "Something Wrong" });
    });
};