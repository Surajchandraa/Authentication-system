const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

let sch=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },

    password:{
        type:String,
        require:true,
        

    },
    phone:{
        type:Number,
        require:true,

    }
})

sch.pre('save',async function(next){
    if(this.isModified('password')){
    this.password=await bcrypt.hashSync(this.password, 12);
    }
    next();
})


module.exports= mongoose.model("data",sch)