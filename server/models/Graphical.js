let mongoose = require('mongoose');

//Schema Validation

let userSchema5 = mongoose.Schema({
    fx : {type: String ,required : true },
    start : {type: Number ,required : true },
    finish : {type: Number ,required : true}
});

let Graphical = mongoose.model('Graphical',userSchema5);
module.exports = Graphical;