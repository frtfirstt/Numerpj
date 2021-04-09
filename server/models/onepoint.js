let mongoose = require('mongoose');

//Schema Validation

let userSchema5 = mongoose.Schema({
    fx : {type: String ,required : true },
    x0 : {type: Number ,required : true}
    
});

let onepoint = mongoose.model('onepoint',userSchema5);
module.exports = onepoint;