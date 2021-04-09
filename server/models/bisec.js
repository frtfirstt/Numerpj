let mongoose = require('mongoose');

//Schema Validation
console.log(mongoose)
let userSchema5 = mongoose.Schema({
    fx : {type: String ,required : true },
    xl : {type: Number ,required : true},
    xr : {type: Number ,required : true}
});

let bisec = mongoose.model('bisec',userSchema5);
module.exports = bisec;