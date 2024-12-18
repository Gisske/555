const port = 4000;
const express = require("express");
const app = express();
exports.app = app;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const { request } = require("http");
const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database Connection 
mongoose.connect("mongodb+srv://GreatEcom:a044848100@cluster0.kta1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
// API Creation

app.get("/", (req, res) => {
    res.send("Express App is Running")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

// Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})


//Create Add product
app.post('/addproduct', async(req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.name,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    })
})

//schema for Creating Products
const Product = mongoose.model("product", {
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    new_price: {
        type: Number,
        require: true,
    },
    old_price: {
        type: Date,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    avilable: {
        type: Boolean,
        default: true,
    },
});
exports.Product = Product;



//create api for productRemoved
app.post('/removeproduct', async(req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })

})

app.listen(port, (error) => {
    if (!error) {
        console.log("Service Running on Port" + port)
    } else {
        console.log("Error : " + error)
    }
})