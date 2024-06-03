const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check_auth");
const ordersController = require("../controllers/orders");


router.get("/", checkAuth, ordersController.orders_get);

router.post("/", checkAuth, ordersController.create_order);

router.get("/:orderID", checkAuth, ordersController.order_get);

router.delete("/:orderID", checkAuth,ordersController.order_delete);

module.exports = router;
