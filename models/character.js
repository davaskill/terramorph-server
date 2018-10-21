var mongoose                    = require('mongoose');
var MongoDBClass                = require('../models/class');
var ExpUtils                    = require('../utils/exputils').ExpUtils;
var ModelUtils                  = require('../utils/modelutils');

var schema = mongoose.Schema({

    user : { type : mongoose.Schema.ObjectId, ref : 'user', required: true },
    class : { type : mongoose.Schema.ObjectId, ref : 'class', required: true },
    level : { type : Number, required: true },
    name : { type : String, required: true },
    exp : { type : Number, required: true },
    unspentpoints : { type : Number, required: true },
    skills : [
        { type : mongoose.Schema.ObjectId, ref : 'skill', required: true }
    ],
    attributes : ModelUtils.attributesModel,
    items : {
        mainhand : { type : mongoose.Schema.ObjectId, ref : 'item', required: false },
        offhand : { type : mongoose.Schema.ObjectId, ref : 'item', required: false },
        chest : { type : mongoose.Schema.ObjectId, ref : 'item', required: false },
        feet : { type : mongoose.Schema.ObjectId, ref : 'item', required: false }
    },

    levelprogress : {
        needed: { type : Number },
        exp: { type : Number },
        percentLeft : { type : Number }
    },
    classes : [
        {
            class : {type: mongoose.Schema.ObjectId, ref: 'class', required: true},
            level : { type : Number, required: true },
            exp : { type : Number, required: true },
            state : {
                needed: { type : Number },
                exp: { type : Number },
                percentLeft : { type : Number }
            }
        }
    ]
});

schema.pre('validate', function (next){
    if(!this.level){
        this.level = 1;
    }
    if(!this.exp){
        this.exp = 0;
    }
    if(!this.attributes){
        this.attributes = {};
    }
    if(!this.attributes.initiative){
        this.attributes.initiative = 0;
    }
    if(!this.attributes.fortitude){
        this.attributes.fortitude = 0;
    }
    if(!this.attributes.speed){
        this.attributes.speed = 0;
    }
    if(!this.attributes.strength){
        this.attributes.strength = 0;
    }
    if(!this.attributes.intelligence){
        this.attributes.intelligence = 0;
    }
    if(!this.attributes.agility){
        this.attributes.agility = 0;
    }
    if(!this.unspentpoints){
        this.unspentpoints = 0;
    }
    this.levelprogress = ExpUtils.getCharacterLevel(this.exp);
    next();
})

schema.pre('save', function(next) {

    console.log("About to save a character. Fixing played/available classes");

    var mongoDBCharacter = this;
    MongoDBClass.find()
        .populate('skills')
        .populate('skills.skill')
        .populate('requirements.skill')
        .exec(function(err, _classes){

            // First, find out what classes we really should have.
            var exposedClasses = [];
            _classes.forEach(function (_class){
                var requirementsMet = 0;
                _class.requirements.forEach(function (classRequirement){
                    mongoDBCharacter.classes.forEach(function (leveledClass){
                        if(leveledClass.class.equals(classRequirement.class) && classRequirement.level <= leveledClass.level){
                            requirementsMet++;
                        }
                    })
                })
                if(requirementsMet == _class.requirements.length) {
                    exposedClasses.push(_class);
                }
            })

            // Make sure the classes are added.
            exposedClasses.forEach(function (_class){
                var wantedPlayedClass = ExpUtils.getPlayedClass(mongoDBCharacter, _class._id);
                wantedPlayedClass.state = ExpUtils.getClassLevelState(wantedPlayedClass.exp);
            });
            next();
        })
});

module.exports = mongoose.model('character', schema);