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
  saveProduct: async (req, res) => {
    if (req.files === null)
      return res.status(400).json({ msg: "Tidak ada file di upload" });
    const category = req.body.category;
    const description = req.body.description;
    const name = req.body.name;
    const price = req.body.price;
    const file = req.files.file;
    const id = `image-${nanoid(12)}`;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = `${nanoid(8)}${ext}`;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Format gambar yang di izinkan .png .jpg .jpeg" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Ukuran gambar tidak lebih dari 5 MB" });

    file.mv(`./app/public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        const product = await Product.create({
          id: id,
          category,
          description,
          name,
          price,
          image: fileName,
          url,
        });

        res.status(200).send({
          auth: true,
          message: "Produk sukses di buat",
          product,
        });
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
    if (!product) return res.status(404).json({ msg: "Tidak terdapat data" });

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
        return res.status(422).json({ msg: "Format gambar yang di izinkan .png .jpg .jpeg" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Ukuran gambar tidak lebih dari 5 MB" });

      const filepath = `./app/public/images/${product.image}`;
      fs.unlinkSync(filepath);

      file.mv(`./app/public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    const category = req.body.category;
    const description = req.body.description;
    const name = req.body.name;
    const price = req.body.price;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
      await Product.update(
        {
          category: category,
          description: description,
          name: name,
          price: price,
          image: fileName,
          url: url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).send({
        auth: true,
        message: "Produk berhasil di update",
      });
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
    if (!product) return res.status(404).json({ msg: "Data tidak ada" });

    try {
      const filepath = `./app/public/images/${product.image}`;
      fs.unlinkSync(filepath);
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: "Produk berhasil di delete" });
    } catch (error) {
      console.log(error.message);
    }
  },
};
