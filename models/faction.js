var mongoose                    = require('mongoose');

var schema = mongoose.Schema({
    name : { type : String, required: true },
    description : { type : String, required: true },
    icon : { type : String, required: true }
});

module.exports = mongoose.model('faction', schema);