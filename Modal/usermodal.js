const mongoose=require('mongoose');
let userData=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        require:true
    },
    image:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admine:{
        type:Number,
        default:0
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
    id:{
        type:String
    }

});

 const Modal= mongoose.model('System',userData);

module.exports={Modal}
