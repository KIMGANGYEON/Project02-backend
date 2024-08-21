import Product from "../models/Product";
import multer from "multer";
import fs from "fs";
import path from "path";

const clearTempUploads = () => {
  const tempDir = path.join(__dirname, "../../uploads_temp");

  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error(err);

    files.forEach((file) => {
      fs.unlink(path.join(tempDir, file), (err) => {
        if (err) console.error(err);
      });
    });
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_temp/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage }).array("file");

export const postProductImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    const fileNames = req.files.map((file) => file.filename);
    return res.json({ fileNames });
  });
};

export const postProductImageDelete = async (req, res) => {
  const { filename } = req.body;

  const filePath = path.join(__dirname, "../../uploads_temp", filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete image." });
    }
    return res.status(200).json({ message: "Image deleted successfully." });
  });
};

export const getProductUpload = async (req, res) => {
  const { user } = req.session;
  return res.status(201).json({ user });
};
``;
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

    productImages.images.forEach((filename) => {
      const tempPath = path.join(__dirname, "../../uploads_temp", filename);
      const finalPath = path.join(__dirname, "../../uploads", filename);

      fs.renameSync(tempPath, finalPath);
    });
    clearTempUploads();
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
  const proudctImages = product[0].images;

  proudctImages.forEach((filename) => {
    const tempPath = path.join(__dirname, "../../uploads_temp", filename);
    const finalPath = path.join(__dirname, "../../uploads", filename);

    fs.copyFileSync(finalPath, tempPath);
  });

  try {
    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);
  }
};

export const postProductEditDetail = async (req, res) => {
  const { id } = req.params;
  const { title, price, description } = req.body.data;
  const productImages = req.body.productImages;
  const product = await Product.find({ _id: id });
  const basicImage = product[0].images;

  try {
    basicImage.forEach((filename) => {
      const finalPath = path.join(__dirname, "../../uploads", filename);
      fs.unlinkSync(finalPath);
    });

    productImages.forEach((filename) => {
      const tempPath = path.join(__dirname, "../../uploads_temp", filename);
      const finalPath = path.join(__dirname, "../../uploads", filename);
      fs.renameSync(tempPath, finalPath);
    });

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { title, price, description, images: productImages },
      { new: true }
    );
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};
