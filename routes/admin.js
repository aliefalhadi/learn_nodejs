const express = require("express");
const path = require("path");
const router = express.Router();
const productsController = require("../controllers/product");

router.get("/add-product", productsController.add);

router.post("/add-product", productsController.store);

router.get("/products", productsController.getAdminProducts);

router.get("/products/:productID", productsController.edit);
router.post("/edit-product", productsController.update);
router.post("/delete-product", productsController.delete);

module.exports = router;
