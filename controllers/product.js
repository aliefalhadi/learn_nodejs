const Products = require("../models/product");
const Cart = require("../models/cart");
exports.add = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    editing: "false"
  });
};

exports.edit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const productID = req.params.productID;
  req.user
    .getProducts({ where: { id: productID } })
    .then(products => {
      const product = products[0];
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        path: "/admin/add-product",
        pageTitle: "Edit Product",
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
};

exports.update = (req, res, next) => {
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.desc;

  Products.update(
    {
      title: updatedTitle,
      price: updatedPrice,
      imageUrl: updatedImageUrl,
      description: updatedDesc
    },
    {
      where: {
        id: productID
      }
    }
  );

  res.redirect("/admin/products");
};

exports.store = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const desc = req.body.desc;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: desc
    })
    .then(result => {
      // console.log("created product");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.delete = (req, res, next) => {
  const productID = req.body.productID;
  Products.findByPk(productID)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("bershasil");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.index = (req, res, next) => {
  Products.findAll()
    .then(products => {
      res.render("shop/index", {
        path: "/",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render("admin/products", {
        path: "/admin/products",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Products.findAll()
    .then(products => {
      res.render("shop/product-list", {
        path: "/products",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productID;
  Products.findByPk(productId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            path: "/cart",
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  let newQuantity = 1;
  let fecthedCart;
  req.user
    .getCart()
    .then(cart => {
      fecthedCart = cart;
      return cart.getProducts({ where: { id: productID } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Products.findByPk(productID);
    })
    .then(product => {
      return fecthedCart.addProducts(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(cart => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.deleteCart = (req, res, next) => {
  const productID = req.body.productID;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productID } });
    })
    .then(products => {
      let product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fecthedCart;
  req.user
    .getCart()
    .then(cart => {
      fecthedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fecthedCart.setProducts(null);
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};
exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      orders: orders
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout"
  });
};
