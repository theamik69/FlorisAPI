const { Product } = require("../models");
const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs");

module.exports = {
  getProducts: async (req, res) => {
    try {
      const response = await Product.findAll();
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  },
  getProductById: async (req, res) => {
    try {
      const response = await Product.findOne({
        where: {
          id: req.params.id,
        },
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  },
  saveProduct(req, res) {
    if (req.files === null)
      return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.title;
    const price = req.body.price;
    const file = req.files.file;
    const id = `image-${nanoid(12)}`;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./app/public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Product.create({
          id: id,
          name: name,
          price: price,
          image: fileName,
          url: url,
        });
        res.status(201).json({ msg: "Product Created Successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    });
  },
  updateProduct: async (req, res) => {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
      fileName = product.image;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      const filepath = `./app/public/images/${product.image}`;
      fs.unlinkSync(filepath);

      file.mv(`./app/public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    const name = req.body.title;
    const price = req.body.price;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
      await Product.update(
        { name: name, price: price, image: fileName, url: url },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  },

  deleteProduct: async (req, res) => {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    try {
      const filepath = `./app/public/images/${product.image}`;
      fs.unlinkSync(filepath);
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: "Product Deleted Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  },
};
