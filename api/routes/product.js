const express = require("express");
const router = express.Router();

const multer = require("multer");
const checkAuth =require("../middleware/check_auth");

const productController = require("../controllers/product")

// Strorage strategy to define how the photo will we stored
const storage = multer.diskStorage({
  destination:function(req,file,cb){
       cb(null,"./uploads/");
  },
  filename: function(req,file,cb){

    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
})

const fileFilter = (req,file,cb)=>{
  if (file.mimetype === 'image/jpej' || file.mimetype === 'image/png'){
    cb(null,true)
  }
  else{
    cb(new Error("Data Saved success But , Photo now saved , input valid file jpeg or png "),false)
  }
}

const upload = multer({ storage : storage ,limits : {
  fileSize : 1024 *1024 *5
},fileFilter : fileFilter
});

router.get("/", productController.products_get);

router.post("/", checkAuth , upload.single("productImage"), productController.product_post);

// getting perticular product from database
router.get("/:productID", productController.product_get);

router.patch("/:productID",checkAuth, productController.product_patch);

router.delete("/:productID", checkAuth,productController.product_delete);

module.exports = router;
