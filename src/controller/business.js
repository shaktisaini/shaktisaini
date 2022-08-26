
let bcrypt =require('bcrypt')
require("../middleware/middleware.js")
let jwt =require('jsonwebtoken')
JWT_SECRET_KEY = "dhsjf3423jhsdf3423df"
let UserModel =require('../model/businessModel')
let businessServices =require('../model/services.model')
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');




//register
 module.exports.businessRegistration = async (req, res) => {
  
  const { name, email,businessName,phoneNumber, password, password_confirmation,address1,address2} = req.body
    console.log("name",req.body);
   
    const user = await UserModel.findOne({ email: email })
    if (user) {
      res.status(401).send({"success":"false", "Status": "401", "message": "Email already exists" })
    } else {
      if (name && email && password && password_confirmation && businessName && phoneNumber && address1 && address2) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const doc = new UserModel({
              name: name,
              email: email,
              businessName:businessName,
              phoneNumber : phoneNumber,
              address1: address1, 
              address2: address2,
              password : hashPassword
              
            })
            await doc.save()
            const saved_user = await UserModel.findOne({ email: email })
            // Generate JWT Token
            const token = jwt.sign({ userID: saved_user._id },JWT_SECRET_KEY, { expiresIn: '5d' })
            res.status(200).send({"success":"True", "status": "200", "message": "Registration Success", "token": token})
          } catch (error) {
            console.log(error)
            res.status(401).send({ "success":"false", "Status": "401", "message": "Unable to Register" })
          }
        } else {
          res.send({ "success":"false", "status": "401", "message": "Password and Confirm Password doesn't match" })
        }
      } else {
        res.status(401).send({"success":"false", "status": "401","message": "All fields are required" })
      }
    }
}
    
//login email or phoneNumber

module.exports.businessLogin = async (req, res) => {
    try {
      const { email, password,phoneNumber} = req.body
      if ( password && (email || phoneNumber)) {
        const user = await UserModel.findOne({ email:email })
        console.log(user);
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if ((user.email === email || user.phoneNumber === phoneNumber) && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userID: user._id },JWT_SECRET_KEY, { expiresIn: '5d' })
            res.status(200).send({ "success":"True", "status": "200", "message": "Login Success", "token": token,user })
          } else {
            res.status(401).send({"success":"false", "status": "401","message": "Email or Password is not Valid" })
          }
        } else {
          res.status(401).send({ "success":"false", "status": "401", "message": "You are not a Registered User" })
        }
      } else {
        res.status(401).send({"success":"false", "status": "401", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.status(401).send({ "success":"false", "status": "401", "message": "Unable to Login" })
    }
  }
  //change  password
  module.exports.changePassword = async (req, res) => {
    const { password, password_confirmation } = req.body
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.status(401).send({ "success":"false", "status": "401","message": "New Password and Confirm New Password doesn't match" })
      } else {
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
        res.status(200).send({ "success":"True", "status": "200", "message": "Password changed succesfully" })
      }
    } else {
      res.status(401).send({"success":"false", "status": "401","message": "All Fields are Required" })
    }
  }
  module.exports.hello = async (req, res) => {
   res.send("hello server");
  }
  //forget password
  module.exports.forgetPassword = async (req, res) => {
    email=req.body.email;
    console.log("emai............=>",email);
    var otp = Math.floor(1000 + Math.random() * 9000);
console.log(otp);
    const user = await UserModel.findOne({ email: email })
    if (!user) {
      res.status(401).send({ "success":"false", "status": "401","message": "Email Not Exists" })
    } else {
      
     const data = await UserModel.updateOne({email:email},{
      $set: {
          otp: otp
      } 
      })
     
var transporter = nodemailer.createTransport(smtpTransport({
    host: "smtp-mail.outlook.com", 
    port: 587,
    secureConnection: false, 
     auth: {
        user: 'aryasaini2020@outlook.com',
        pass: 'arya2020'
    },
  }));
console.log("helo2222");   

var mailOptions = {
    from: 'aryasaini2020@outlook.com', 
    to: email, 
    subject: 'Hello ', 
    text: 'verify otp =>'+otp, 

};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    res.status(200).send({ "success":"True", "status": "200", "message": "OTP Send succesfully Your Mail" })
    console.log('Message sent: ' + info.response);
});

            
          }
        }
  //verify Otp
module.exports.verifyOtp = async (req, res) => {
  
  const { otp, email} = req.body
  console.log(req.body);
  const saved_user = await UserModel.findOne({$and: [{otp: otp}, {email : email}]})
  const token = jwt.sign({ userID: saved_user._id },JWT_SECRET_KEY, { expiresIn: '5d' })
  if (saved_user) {
    res.status(401).send({"success":"True", "status": "200", "message": "OTP verify succesfully",token })
  } else {
    res.status(401).send({ "success":"false", "status": "401", "message": "OTP Not Found" })
            
          }
        }
  //setNewPassword

        module.exports.setPassword = async (req, res) => {
  
          const { password} = req.body
          console.log(req.body);
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          const saved_user = await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
        
          if (saved_user) {
            res.status(200).send({ "success":"True", "status": "200", "message": "Set Password succesfully"})
          } else {
            res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
                    
          }
                
                }

        // get profile

        module.exports.getProfile = async (req, res) => {

        
          let   _id = req.body._id
          
          console.log("id",_id);
          const saved_user = await UserModel.findById({_id},{_id:0,businessLogo:1,images:1,noOfEmployee:1,businessName:1,email:1,phoneNumber:1,address1:1,address2:1})
        
          if (saved_user) {
            res.status(200).send({"success":"True", "status": "200", "message": "get Profile succesfully",saved_user})
          } else {
            res.status(401).send({ "status": "failed", "message": "Something Went Wrong" })
                    
                  }
                }
    // update profile
          module.exports.updateProfile = async (req, res) => {
           let   _id = req.body._id
           console.log("id",_id);
          const saved_user = await UserModel.findByIdAndUpdate(
            { _id},
            {
              businessLogo:req.body.businessLogo,
              images : req.body.images,
              email:req.body.email,
              businessName:req.body.businessName,
              phoneNumber : req.body.phoneNumber,
              address1: req.body.address1, 
              address2: req.body.address2, 
            },
          );
        
          if (saved_user) {
            res.status(200).send({"success":"True", "status": "200", "message": "update Profile succesfully",saved_user})
          } else {
            res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
                    
                  }
                }
   //update location api
          module.exports.updateCurrentLocation = async (req, res) => {
               let   _id = req.body._id
               console.log("id",_id);
                const saved_user = await UserModel.findByIdAndUpdate(
                  { _id},
                  {
                    currentLocation:req.body.currentLocation,
                    street:req.body.street,
                    landmark:req.body.landmark,
                    city:req.body.city,
                    state:req.body.state,
                    pincode:req.body.pincode,
                 },
                );
              if (saved_user) {
                res.status(200).send({"success":"True", "status": "200", "message": "location Update succesfully",saved_user})
                } else {
                  res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
                          
                        }
                      }
//get location
   module.exports.getCurrentLocation = async (req, res) => {
    let   _id = req.body._id
    console.log("id",_id);
    const saved_user = await UserModel.findById({_id},{_id:0,currentLocation:1,street:1,landmark:1,city:1,state:1,pincode:1})
  if (saved_user) {
    res.status(200).send({"success":"True", "status": "200", "message": "get current succesfully",saved_user})
    } else {
      res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
              
            }
          }


//colorupdat
          module.exports.updatecolor = async (req, res) => {
            let   _id = req.body._id
            console.log("id",_id);
           const saved_user = await UserModel.findByIdAndUpdate(
             { _id},
             {
              color:req.body.color,
               
             },
           );
         
           if (saved_user) {
            res.status(200).send({"success":"True", "status": "200", "message": "update color succesfully",saved_user})
           } else {
            res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
                     
                   }
                 }
          //get color
  
module.exports.getColor = async (req, res) => {
           
            const saved_user = await UserModel.find({},{_id:0,color:1})
          if (saved_user) {
            res.status(200).send({"success":"True", "status": "200", "message": "get color succesfully",saved_user})
            } else {
              res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
      
            }
          }
//create service
module.exports.createService = async (req, res) => {
  
  const { serviceName, color,businessId} = req.body
  if (serviceName && color && businessId ){
  const doc = new businessServices({
    serviceName: serviceName,
    color: color,
    businessId:businessId,
    image:req.file.path
              })
            await doc.save()
   res.status(200).send({"success":"True", "status": "200", "message": "Business  Create Successfully"})
  }else{
    res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
        }
      }
      //list services
  
      module.exports.listServices = async (req, res) => {
           
        const saved_user = await businessServices.find()
      if (saved_user) {
        res.status(200).send({"success":"True", "status": "200", "message": "List get  succesfully",saved_user})
        } else {
          res.status(401).send({ "success":"false", "status": "401","message": "Something Went Wrongs" })
  
        }
      }
