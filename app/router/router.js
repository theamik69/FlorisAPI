const { authentication } = require("../middleware/auth");
const auntController = require("../controller/auntController");
const productController = require("../controller/productController");

module.exports = function (app) {
  app.post("/signin", auntController.signin);
  app.post("/signout", authentication, auntController.signout);

  app.get("/products", productController.getProducts);

  app.get("/products/:id", productController.getProductById);

  app.post("/products", authentication, productController.saveProduct);

  app.patch("/products/:id", authentication, productController.updateProduct);

  app.delete("/products/:id", authentication, productController.deleteProduct);
};
