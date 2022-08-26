
module.exports = app=>{
    let router =require('express').Router()
    let userControllers  = require("../controller/business.js")

    const multer = require('multer');
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    
    let uploadImg = multer({ storage: storage });
    console.log("hiii");
    
    router.post('/crateServices', uploadImg.single('image'),userControllers.createService); 

    

   
app.use('/',router)
}