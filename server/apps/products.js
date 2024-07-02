import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find().toArray();
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    return res.json({ data: products });
  } catch {
    res.status(500).json({ message: `Failed to get products` });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const product = await collection.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ data: product });
  } catch {
    res.status(500).json({ message: "Failed to get product" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body };
    const products = await collection.insertOne(productData);
    return res.json({ message: `Product has been created successfully` });
  } catch {
    res.status(400).json({ message: `Failed to create product` });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const newProductData = { ...req.body };
    await collection.updateOne({ _id: productId, $set: newProductData });
    return res.json({ message: `Product has been updated successfully` });
  } catch {
    res.status(400).json({ message: `Failed to update product` });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: productId });
    return res.json({ message: `Product has been deleted successfully` });
  } catch {
    res.status(400).json({ message: `Failed to delete product` });
  }
});

export default productRouter;
