
let mongoose =require('mongoose')
// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String,default:""},
  businessName: { type: String,default:"" },
  email: { type: String },
  phoneNumber: { type: String},
  password: { type: String },
  otp: { type: Number,default:""},
  address1: { type: String },
  address2: { type: String },
  noOfEmployee : {type:String,default:"10-20"},
  businessLogo: { type: String,default:""},
  images: { type: Array,default:"" },
  currentLocation: { type: String,default:""},
 
  street: { type: String,default:""},
  landmark: { type: String,default:""},
  city: { type: String,default:""},
  state: { type: String,default:""},
  pincode: { type: String,default:""},

  color:[{
    colorName:{ type: String,default:"Blue"},
    colorCode:{ type: String,default:"#fffff"},
    colorId: { type: String},
  }],

  serviceName:{ type: String,default:""},
  color:{ type: String,default:""},
  businessId:{ type: String,default:""},


  
},
{ timestamps: true }
)

// Model
const UserModel = mongoose.model("business", userSchema)

module.exports=UserModel;