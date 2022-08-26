let mongoose =require('mongoose');


mongoose.connect("mongodb+srv://root:root@cluster0.ipypo5c.mongodb.net/gratszee",{
    
     useUnifiedTopology: true,
     useNewUrlParser: true,
    
   }).
then( ()=> console.log("connect is successfully"))
.catch((err)=>
console.log("Something Went Wrong",err)
)

