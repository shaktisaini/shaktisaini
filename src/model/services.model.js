
let mongoose =require('mongoose')
// Defining Schema
const userSchema = new mongoose.Schema({


  serviceName:{ type: String,default:""},
  color:{ type: String,default:""},
  businessId:{ type: String,default:""},
  image:{ type: String},


  
},
{ timestamps: true }
)

// Model
const UserModel = mongoose.model("businessServices", userSchema)

module.exports=UserModel;