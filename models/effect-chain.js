var mongoose                    = require('mongoose');
var ModelUtils                  = require('../utils/modelutils');

var schema = mongoose.Schema({
    name : { type : String, required: true },
    buildup : {
        time : { type : Number },
        particleSystems : [
            {type: mongoose.Schema.ObjectId, ref: 'particleSystem'},
        ]      
    },
    projectile : {
        arc : {type: Boolean, required: false},
        speed : { type : Number },
        particleSystems : [
            {type: mongoose.Schema.ObjectId, ref: 'particleSystem'},
        ]      
    },
    hit : {
        time : { type : Number },
        particleSystems : [
            {type: mongoose.Schema.ObjectId, ref: 'particleSystem'},
        ]      
    }
});

module.exports = mongoose.model('effect-chain', schema);