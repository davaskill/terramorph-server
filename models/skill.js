var mongoose                = require('mongoose');
var ModelUtils              = require('../utils/modelutils');

var schema = mongoose.Schema({
    name : { type : String, required: true },
    description : { type : String, required: true },
    icon : { type : String, required: false },
    reach : ModelUtils.reachModel,
    spread : ModelUtils.reachModel,
    effects : [
        ModelUtils.effectModel
    ],
    effectChain : { type: mongoose.Schema.ObjectId, ref: 'effect-chain', required: true }
});

module.exports = mongoose.model('skill', schema);