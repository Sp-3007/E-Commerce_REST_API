const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_get = (req, res, next) => {
    Order.find()
      .populate("product", "name _id price") // to get the result from relational part
      .select("_id product quantity")
      .then((docs) => {
        if (docs.length > 0) {
          res.status(200).json({
            count: docs.length,
            Orders: docs,
          });
        } else {
          res.status(200).json({
            message: "No Data Releted TO The Orders",
          });
        }
      });
  };

  exports.create_order = (req, res, next) => {
    const productID = req.body.productID;
    Product.findById(productID).then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "No such product with this ID enter valid product id",
        });
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: productID,
        quantity: req.body.quantity,
      });

      console.log(order.product);
      order
        .save()
        .then((result) => {
          res.status(200).json({
            Order_id: result._id,
            Product_Id: result.product,
            quantity: result.quantity,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    });
  };

  exports.order_get = (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
      .populate("product", "name _id price")
      .then((order) => {
        if (order) {
          res.status(200).json({
            order: {
              orderID: order._id,
              product: order.product,
              quantity: order.quantity,
            },
          });
        } else {
          res.status(404).json({
            message: "No data found in database",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  };

  exports.order_delete = (req, res, next) => {
    const id = req.params.orderID;
    Order.deleteOne({ _id: id })
      .then((result) => {
        res.status(200).json({
          Message: `Order with ID ${id} is removed`,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ Message: "Something Wrong" });
      });
  };
