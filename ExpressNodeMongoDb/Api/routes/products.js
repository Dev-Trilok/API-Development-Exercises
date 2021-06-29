const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map(doc=>{
          return{
            name:doc.name,
            price:doc.price,
            _id:doc._id,
            request:{ //more info :optional
              type:'GET',
              url:"http://localhost:3000/products/"+doc._id
            }
          }
        })
      };
      // console.log(docs);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created successfully! ",
        createdProduct: {
          name:result.name,
          price:result.price,
          _id:result._id,
          request:{
            type:'GET',
              url:"http://localhost:3000/products/"+result._id
            
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id')
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({ 
          product:doc,
          request:{
            type:'GET',
            Description:'GET_ALL_PRODUCTS',
            url:"http://localhost:3000/products/"
            
          }
         });
      } else {
        res.status(404).json({ message: "No valid entry found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        Message:"Product Deleted",
        request:{
          type:'POST',
          url:"http://localhost:3000/products/"+id
          body:{name:'String', price:'Number'}

        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  // Product.updateOne({ _id: id },{$set: {name:req.body.newName, price:req.body.newPrice}}
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        Message:'Product Updated',
        request:{
          type:'GET',
          Description:'You can send request here...',
          url:"http://localhost:3000/products/",

        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
