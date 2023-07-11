const verifySignUpController = require("../controller/verifySignUp");
const verifyJwtTokenController = require("../controller/verifyJwtToken");
const userController = require("../controller/userController");
const productController = require("../controller/productController");

module.exports = function (app) {
  app.post(
    "/registration",
    verifySignUpController.checkDuplicateAdmin,
    userController.signup
  );

  app.post("/signin", userController.signin);

  app.patch(
    "/admin/:id",
    verifyJwtTokenController.verifyToken,
    userController.update
  );

  app.delete(
    "/admin/:id",
    verifyJwtTokenController.verifyToken,
    userController.delete
  );

  app.get("/products", productController.getProducts);

  app.get("/products/:id", productController.getProductById);

  app.post("/products", productController.saveProduct);

  app.patch("/products/:id", productController.updateProduct);

  app.delete("/products/:id", productController.deleteProduct);
};
