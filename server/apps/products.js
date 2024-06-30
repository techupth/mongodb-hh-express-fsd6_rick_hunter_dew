import { Router } from "express";
import { ObjectId } from "mongodb";

// 1) Import ตัว Database ที่สร้างไว้มาใช้งาน
import { db } from "../utils/db";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  let productList;
  try {
    // 2) เลือก Collection ที่ชื่อ `products`
    const collection = db.collection("products");
    // 3) เริ่ม Query โดยใช้ `collection.find(query)`
    productList = await collection.find().toArray();
  } catch (error) {
    // จัดการกับข้อผิดพลาดที่เกิดขึ้น
    return res.status(500).json({
      message: "Server could not read products because of database connection",
    });
  }

  // 4) Return ตัว Response กลับไปหา Client
  return res.status(200).json({ data: products });
});

productRouter.get("/:id", async (req, res) => {
  // 2) เลือก Collection ที่ชื่อ `products`
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.id);

  let productDetails;
  try {
    // 3) เริ่ม Query โดยใช้ `collection.findOne(query)`
    productDetails = await collection.findOne({
      _id: productId,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not read a specific product because of database connection",
    });
  }

  if (!product) {
    return res.status(404).json({
      message: `Server could not find a specific product (_id: ${productId})`,
    });
  }

  // 4) Return ตัว Response กลับไปหา Client
  return res.status(200).json({ data: product });
});

productRouter.post("/", async (req, res) => {
  // 2) เลือก Collection ที่ชื่อ `products`
  const collection = db.collection("products");
  // 3) เริ่ม Insert ข้อมูลลงใน Database โดยใช้ `collection.insertOne(query)`
  // นำข้อมูลที่ส่งมาใน Request Body ทั้งหมด Assign ใส่ลงไปใน Variable ที่ชื่อว่า `productData`
  const productData = { ...req.body };
  let insertedProduct = [];
  try {
    insertedProduct = await collection.insertOne(productData);
    // console.log(products);
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not create a new product because of database connection",
    });
  }
  // 4) Return ตัว Response กลับไปหา Client
  return res.status(201).json({
    message: `Product record (${insertedProduct.insertedId}) has been created successfully`,
  });
});

productRouter.put("/:id", async (req, res) => {
  // 2) เลือก Collection ที่ชื่อ `products`
  const collection = db.collection("products");

  // 3) Update ข้อมูลใน Database โดยใช้ `collection.updateOne(query)` โดยการ
  // นำ productId  จาก Endpoint parameter มา Assign ลงใน Variable `productId `
  // โดยที่ใช้ ObjectId ที่ Import มาจากด้านบน ในการ Convert Type ด้วย
  const productId = new ObjectId(req.params.id);
  // นำข้อมูลที่ส่งมาใน Request Body ทั้งหมด Assign ใส่ลงไปใน Variable ที่ชื่อว่า `newProductData`
  const newProductData = { ...req.body, modified_at: new Date() };

  let updatedProduct;
  try {
    updatedProduct = await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not update a specific product because of database connection",
    });
  }
  if (!updatedProduct.modifiedCount) {
    return res.status(404).json({
      message: `Server could not find a specific product (_id: ${productId}) to update`,
    });
  }
  // 4) ส่ง Response กลับไปหา Client
  return res.status(201).json({
    message: `Product record (${productId}) has been updated successfully`,
  });
});

productRouter.delete("/:id", async (req, res) => {
  // 2) เลือก Collection ที่ชื่อ `products`
  const collection = db.collection("products");

  // 3) Delete ข้อมูลออกจากใน Database โดยใช้ `collection.deleteOne(query)`
  // นำ productId จาก Endpoint parameter มา Assign ลงใน Variable `productId`
  const productId = new ObjectId(req.params.id);

  let deleteProduct;
  try {
    deleteProduct = await collection.deleteOne({ _id: productId });
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not delete a specific product because of database connection",
    });
  }

  if (!deleteProduct.deletedCount) {
    return res.status(404).json({
      message: `Server could not find a specific product (_id: ${productId}) to delete`,
    });
  }
  // 4) ส่ง Response กลับไปหา Client
  return res.status(200).json({
    message: `Product record (${productId}) has been deleted successfully`,
  });
});

export default productRouter;
