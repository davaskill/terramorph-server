var authutils               = require('../utils/authutils');
var mongoose                = require('mongoose');
var fs                      = require('fs');

module.exports = function(express, passport) {

    // =======================================================
    // AUTO-GENERATED CRUD API.
    // THIS IS ONLY ALTERABLE BY 'basic-admin', E.G ADMINS.
    // =======================================================
    // Allow basic auth, and any other auth if not basic.
    var apiFilters = [ passport.authenticate('basic-admin'),  authutils.isLoggedIn ];
    var router = express.Router();
    var schemas = [];

    // Load all models in the models dir.
    fs.readdirSync(__dirname + '/../models').forEach(function (fileName){
        if(~fileName.indexOf('.js')){
            require(__dirname + '/../models/' + fileName);
            console.log("Loaded model: " + fileName + " @ " + __dirname + '/app/models/' + fileName);
        }
    });

    // Load all models in the models dir.
    fs.readdirSync('./models').forEach(function (fileName){
        console.log("Loading upp API methods for: " + fileName);

        var schemaName = fileName.split(".")[0];
        var schema = require('../models/' + schemaName + '.js');
        var Class = mongoose.model(schemaName);

        schemas.push(schemaName);

        // READ (GET)
        router.get('/' + schemaName, apiFilters, function(req, res) {

            Class.find()
                .populate(schemaName)
                .exec(function(err, result){
                    // If schema options are set we seek to populate the
                    // returned schema. If not, just return as as.
                    if(schema.options !== undefined) {
                        Class.populate(result, schema.options, function (err, result) {
                            res.send(result);
                        });
                    } else {
                        res.send(result);
                    }
                });
        });

        // SAVE (POST)
        router.post('/' + schemaName, apiFilters, function(req, res) {
            saveOrUpdate(Class, req.body, function (err, object) {
                if (err) {
                    res.status(400).send('Bad Request');
                } else {
                    Class.findOne({_id : object._id})
                        .populate(schemaName)
                        .exec(function(err, result){
                            // If schema options are set we seek to populate the
                            // returned schema. If not, just return as as.
                            if(schema.options !== undefined) {
                                Class.populate(result, schema.options, function (err, result) {
                                    res.send(result);
                                });
                            } else {
                                res.send(result);
                            }
                        });
                }
            })
        });

        // SAVE (PUT)
        router.put('/' + schemaName + "/:_id", apiFilters, function(req, res) {
            var _id = req.params._id;
            var data = req.body;
            if(_id){
                // Create a plain data object and remove the ID.
                var updateData = new Class(data).toObject();
                delete updateData._id;
                // Perform the update.
                Class.update(
                    { '_id' : _id},
                    updateData,
                    function(err){
                        if(err){
                            console.log("Failed to update object: ", updateData);
                            res.status(404).send('Bad Request');
                        }
                        Class.findOne({_id : _id})
                            .populate(schemaName)
                            .exec(function(err, result){
                                // If schema options are set we seek to populate the
                                // returned schema. If not, just return as as.
                                if(Class.options !== undefined) {
                                    Class.populate(result, Class.options, function (err, result) {
                                        res.send(result);
                                    });
                                } else {
                                    res.send(result);
                                }
                            });
                    }
                )
            } else {
                res.status(404).send('Bad Request');
            }
        });

        // DELETE (DELETE)
        router.delete('/' + schemaName + '/:_id', apiFilters, function(req, res) {
            Class.remove({'_id' : req.params._id}, function(err){
                if(err){
                    res.status(400).send('Bad Request');
                } else {
                    res.send("Deleted entity");
                }
            });
        });


    });

    router.get('/meta', apiFilters, function (req, res){
        var paths = [];
        schemas.forEach(function (schema){
            paths.push(req.headers.host + '/api/' + schema);
        })
        res.json(paths);

    })

    saveOrUpdate = function (schema, object, callback){
        // Create a new object from the schema.
        var newObject = new schema(object)

        // Check if this is an upate or a save. Performa an update
        // if there is nu "_id" key, otherwise perform a save.
        if(object._id){
            // Create a plain data object and remove the ID.
            var updateData = newObject.toObject();
            delete updateData._id;
            // Perform the update.
            schema.update(
                { '_id' : object._id},
                updateData,
                function(err){
                    if(err){
                        console.log("Failed to update object: ", object);
                    }
                    return callback(err, object);
                }
            )
        } else {
            // Perform the save.
            newObject.save(function(err){
                if(err){
                    console.log("Failed to save object: ", object);
                }
                return callback(err, newObject);
            })
        }
    }

    return router;
}