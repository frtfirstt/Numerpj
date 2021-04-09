let mongoose = require('mongoose');

//Schema Validation

let userSchema = mongoose.Schema({
    firstname : {type:String , require:true},
    lastname : String,
    email : {type : String,require :true,lowercase:true,trim:true},
    age : {type: Number , min : 1,max :100,default:15},
    status:{type:String , enum:["active","pending"],required:true},
    create_date:{type:Date , default:Date.now}
});

let User = mongoose.model('User',userSchema);
module.exports = User;