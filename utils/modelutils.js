var mongoose                = require('mongoose');
var modelUtils              = { };

modelUtils.span = {
    min : { type : Number, required: true },
    max : { type : Number, required: true },
}
modelUtils.vector3 = {
    x : { type : Number, required: true },
    y : { type : Number, required: true },
    z : { type : Number, required: true },
}

modelUtils.attributesModel = {
    initiative : { type : Number, required: true },
    fortitude : { type : Number, required: true },
    speed : { type : Number, required: true },
    strength : { type : Number, required: true },
    intelligence : { type : Number, required: true },
    agility : { type : Number, required: true }
};

modelUtils.reachModel = {
        type: {type: String, required: false},
        distance: {type: Number, required: false},
        heightTolerance: {type: Number, required: false},
        heightToleranceType: {type: String, required: false},
        nonpathed: {type: Boolean, required: false},
        tilerestrictions: {
            height: {
                min: {type: Number, required: false},
                max: {type: Number, required: false},
            },
            type: {type: String, required: false}
        }
};

modelUtils.effectModel = {
        selfImmune: {type: Boolean, required: false},
        type: {type: String, required: false},
        subtype: {type: String, required: false},
        value: {
            min: {type: Number, required: false},
            max: {type: Number, required: false}
        },
        duration: {type: Number, required: false},
        scale: modelUtils.attributesModel,
        spread : modelUtils.reachModel
};

module.exports = modelUtils;