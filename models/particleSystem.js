var mongoose                    = require('mongoose');
var ModelUtils                  = require('../utils/modelutils');

var schema = mongoose.Schema({
    name : { type : String, required: true },

    textureName : { type : String, required: true },

    sizeRandomness : { type : Number, required: true },
    size : { type : Number, required: true },

    spawnRate : { type : Number, required: true },
    maxParticles : { type : Number, required: true },
    positionRandomness : { type : Number, required: true },
    lifetime : { type : Number, required: true },
    velocity : ModelUtils.vector3,
    velocityRandomness : { type : Number, required: true },
    turbulence :{ type : Number, required: true },

});

module.exports = mongoose.model('particleSystem', schema);