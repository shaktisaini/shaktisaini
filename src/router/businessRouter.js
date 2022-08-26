module.exports = app=>{
    let router =require('express').Router()
    let userControllers  = require("../controller/business.js")
  

    let {checkUserAuth}  = require("../middleware/middleware")




//business
router.use('/changePassword', checkUserAuth)
router.post("/setPassword",checkUserAuth);
    router.post("/register",userControllers.businessRegistration);
    router.post("/login",userControllers.businessLogin);
    router.post("/changePassword",userControllers.changePassword);
    router.post("/forgetPassword",userControllers.forgetPassword);
    router.post("/verifyPassword",userControllers.verifyOtp);
    router.post("/setPassword",userControllers.setPassword);
    router.post("/getProfile",userControllers.getProfile);
    router.post("/updateProfile",userControllers.updateProfile);
    router.post("/updateLocation",userControllers.updateCurrentLocation);
    router.post("/getLocation",userControllers.getCurrentLocation);
    router.post("/getcolor",userControllers.getColor);
    router.post("/updatecolor",userControllers.updatecolor);
    router.post("/listServices",userControllers.listServices);

    


//testing
    router.get("/hello",userControllers.hello);


    

   
app.use('/',router)
}