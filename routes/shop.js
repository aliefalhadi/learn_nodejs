const express = require("express");
const path = require("path");
const productController = require("../controllers/product");
const router = express.Router();

router.get("/", productController.index);
router.get("/cart", productController.getCart);
router.post("/cart", productController.postCart);
router.post("/order", productController.postOrder);
router.post("/delete-cart-item", productController.deleteCart);
router.get("/products", productController.getProducts);
router.get("/products/:productID", productController.getProduct);
router.get("/orders", productController.getOrders);
router.get("/checkout", productController.getCheckout);

module.exports = router;
