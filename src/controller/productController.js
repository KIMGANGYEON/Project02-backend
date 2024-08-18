import Product from "../models/Product";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage }).array("file");

export const postProductImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return req.status(500).send(err);
    }
    const fileNames = req.files.map((file) => file.filename);
    return res.json({ fileNames });
  });
};

export const getProductUpload = async (req, res) => {
  const { user } = req.session;
  return res.status(201).json({ user });
};

export const postProductUpload = async (req, res) => {
  const { data, productImages } = req.body;

  try {
    const product = new Product({
      title: data.title,
      description: data.description,
      price: Number(data.price),
      images: productImages.images,
    });
    await product.save();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};

export const getProductEdit = async (req, res) => {
  const { user } = req.session;
  const product = await Product.find().populate("writer");
  try {
    console.log(product);
    return res.status(201).json({ user, product });
  } catch (error) {
    console.error(error);
  }
};

export const postProductEdit = async (req, res) => {};
