var mongoose                = require('mongoose');
var ModelUtils              = require('../utils/modelutils');

var schema = mongoose.Schema({
    name : { type : String, required: true },
    nodes: [
            {
                skill: { type : mongoose.Schema.ObjectId, ref : 'skill', required: false },
                attributes: ModelUtils.attributesModel,
                x: { type : Number, required: true },
                y: { type : Number, required: true }
            }
    ]
});

module.exports = mongoose.model('levelgrid', schema);