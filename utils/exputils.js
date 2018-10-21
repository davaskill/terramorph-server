
var MongoDBClass                = require('../models/class');

var CHARACTER_EXP_POW           = 3;
var CHARACTER_EXP_CONSTANT      = 100;
var CLASS_EXP_POW               = 2.5;
var CLASS_EXP_CONSTANT          = 60;

function LevelCalculator(pow, constant) {
    var _this = this;

    _this.getRequiredExpForLevel = function (level) {
        return Math.floor(Math.pow(level, pow) + (level * constant));
    }

    _this.getExpObject = function (exp) {
        var currentLevel = 0;
        var nextLevel = 0;

        for (var i = 0; i < 100; i++) {
            if (_this.getRequiredExpForLevel(i) > exp) {
                nextLevel = i;
                currentLevel = i - 1;
                break;
            }
        }

        var expForCurrentLevel = _this.getRequiredExpForLevel(currentLevel);
        var expForNextLevel = _this.getRequiredExpForLevel(nextLevel);
        var expNeedeForEntireLevel = expForNextLevel - expForCurrentLevel;
        var expThisLevel = exp - expForCurrentLevel;
        var expLeftUntilLevelUp = expForNextLevel - expThisLevel;

        return {
            current: {
                level: currentLevel,
                exp: expForCurrentLevel
            },
            next: {
                level: nextLevel,
                exp: expForNextLevel,
            },
            needed: expNeedeForEntireLevel,
            exp: expThisLevel,
            left: expLeftUntilLevelUp,
            percentLeft: (expThisLevel / expNeedeForEntireLevel) * 100.0
        }
    }
}

function getPlayedClass(mongodDBCharacter, classObejctId){
    // Fid the class that this character had.
    // If it is not found, simply create it.
    var wantedPlayedClass = null;
    mongodDBCharacter.classes.forEach(function (playedClass) {
        if (playedClass.class == classObejctId ||
            playedClass.class.equals(classObejctId)) {
            wantedPlayedClass = playedClass;
        }
    })

    if (wantedPlayedClass === null) {
        wantedPlayedClass = {
            class: classObejctId,
            level: 0,
            exp: 0
        }
        mongodDBCharacter.classes.push(wantedPlayedClass);
    }
    return wantedPlayedClass;
}

function getCurrentClassExp(mongodDBCharacter){
    return getPlayedClass(mongodDBCharacter, mongodDBCharacter.class);
}

function fixPlayedClasses (mongoDBCharacter){
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
                fixPlayedClass(mongoDBCharacter, _class._id);
            });
            mongoDBCharacter.save();
        })

        }

module.exports = {
    ExpUtils: {
        getCharacterLevel: function (exp) {
            return new LevelCalculator(CHARACTER_EXP_POW, CHARACTER_EXP_CONSTANT).getExpObject(exp);
        },
        getClassLevelState: function (exp) {
            return new LevelCalculator(CLASS_EXP_POW, CLASS_EXP_CONSTANT).getExpObject(exp);
        },
        getCurrentClassExp: getCurrentClassExp,
        getPlayedClass : getPlayedClass
    }
}