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
  const { user } = req.session;
  const { data, productImages } = req.body;

  try {
    const product = new Product({
      writer: user._id,
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
  const product = await Product.find({ writer: user._id }).populate("writer");
  try {
    return res.status(201).json({ user, product });
  } catch (error) {
    console.error(error);
  }
};

export const postProductEdit = async (req, res) => {};

export const getProductEditDetail = async (req, res) => {
  const { id } = req.params;
  const product = await Product.find({ _id: id });
  try {
    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);
  }
};

export const postProductEditDetail = async (req, res) => {};
