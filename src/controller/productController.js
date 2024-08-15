import Product from "../models/Product";

export const postProductUpload = async (req, res) => {
  try {
    const product = new Product(req.body);
    product.save();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};
