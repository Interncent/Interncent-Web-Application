const mongoose =require('mongoose');
const fileSchema=new mongoose.Schema ({
  files:String,
  author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
  }
});

module.exports=mongoose.model('File',fileSchema)