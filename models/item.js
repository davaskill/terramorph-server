var mongoose                = require('mongoose');
var ModelUtils              = require('../utils/modelutils');

var schema = mongoose.Schema({
    name : { type : String, required: true },
    description : { type : String, required: true },
    slot : { type : String, required: true },
    icon : { type : String, required: false },
    reach : ModelUtils.reachModel,
    spread : ModelUtils.reachModel,
    statusEffects : [
        ModelUtils.effectModel
    ],
    attackEffects : [
        ModelUtils.effectModel
    ],
    skill : { type: mongoose.Schema.ObjectId, ref: 'skill', required: false }
});

module.exports = mongoose.model('item', schema);