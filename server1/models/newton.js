let mongoose = require('mongoose');

//Schema Validation

let userSchema5 = mongoose.Schema({
    fx : {type: String ,required : true },
    x0 : {type: Number ,required : true}
    
});

let newton = mongoose.model('newton',userSchema5);
module.exports = newton;