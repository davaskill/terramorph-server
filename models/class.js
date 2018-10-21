var mongoose                    = require('mongoose');
var ModelUtils                  = require('../utils/modelutils');

var schema = mongoose.Schema({

    name : { type : String, required: true },
    icon : { type : String, required: false },
    attributes : ModelUtils.attributesModel,
    skills : [
        {
            skill : {type: mongoose.Schema.ObjectId, ref: 'skill', required: true},
            level : { type : Number, required: true }
        }
    ],
    requirements : [
        {
            class : { type : mongoose.Schema.ObjectId, ref : 'class', required: true },
            level : { type : Number, required: true }
        }
    ]
});

module.exports = mongoose.model('class', schema);