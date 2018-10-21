var authutils           = require('../utils/authutils');
var MongoDBCharacter    = require('../models/character');
var MongoDBClass        = require('../models/class');
var ExpUtils            = require('../utils/exputils').ExpUtils;

module.exports = function(express, passport) {

    var apiFilters = [ authutils.isLoggedIn ];
    var router = express.Router();

    router.put('/:_id', apiFilters,  function (req, res) {
        var _id = req.params._id;
        var data = req.body;
        if(_id){
            // Create a plain data object and remove the ID.
            var updateData = new MongoDBCharacter(data).toObject();
            delete updateData._id;
            // Perform the update.
            MongoDBCharacter.update(
                { '_id' : _id},
                updateData,
                function(err){
                    if(err){
                        console.log("Failed to update object: ", updateData);
                        res.status(404).send('Bad Request');
                    }
                    MongoDBCharacter.findOne({_id : _id})
                        .exec(function(err, result){
                            res.send(result);
                        });
                }
            )
        } else {
            res.status(404).send('Bad Request');
        }
    });

    router.post('/', apiFilters,  function (req, res){
        var data = req.body;
        data.user = req.user._id;

        // Newly created character should start at class level 1.
        data.classes = [ {
            class : data.class,
            level : 1,
            exp : 70,
            state : {
                needed: 70,
                exp: 50,
                percentLeft : 50/70
            }
        } ]

        var newObject = new MongoDBCharacter(data);
        newObject.save(function(err) {
            if (err) {
                console.log("Failed to save object: ", err, newObject);
            }
            MongoDBCharacter.findOne({_id : newObject._id})
                .exec(function(err, result){
                    res.send(result);
                });
        })
    })

    router.get('/', apiFilters,  function (req, res){
        MongoDBCharacter.find({ user : req.user._id})
            .exec(function(err, mongoDBCharacters) {
                var result = [];
                mongoDBCharacters.forEach(function (character){
                    var nonMongoDBCharacter = character.toObject();
                    nonMongoDBCharacter.characterExpStatus = ExpUtils.getCharacterLevel(character.exp);
                    result.push(nonMongoDBCharacter);
                })
                res.send(result);
            });
    });

    router.get('/:_id/classes', apiFilters,  function (req, res){
        MongoDBCharacter.findOne({ user : req.user._id, _id : req.params._id })
            .exec(function(err, resultCharacter){
                var charactersLeveledClasses = resultCharacter.classes ? resultCharacter.classes : [];

                MongoDBClass.find()
                    .populate('skills')
                    .populate('skills.skill')
                    .populate('requirements.skill')
                    .exec(function(err, _classes){

                    var exposedClasses = [];
                    _classes.forEach(function (_class){
                        var requirementsMet = 0;
                        _class.requirements.forEach(function (classRequirement){
                            charactersLeveledClasses.forEach(function (leveledClass){
                                if(leveledClass.class.equals(classRequirement.class) && classRequirement.level <= leveledClass.level){
                                    requirementsMet++;
                                }
                            })
                        })
                        if(requirementsMet == _class.requirements.length) {
                            exposedClasses.push(_class);
                        }
                    })

                    res.send(exposedClasses);
                });
            });
    });

    router.delete('/:_id', apiFilters,  function (req, res) {
        MongoDBCharacter.remove({'_id': req.params._id, user: req.user._id}, function (err) {
            if (err) {
                res.status(400).send('Bad Request');
            } else {
                res.send("Deleted entity");
            }
        });
    });

    return router;
}