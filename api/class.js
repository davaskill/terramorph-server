var authutils               = require('../utils/authutils');

module.exports = function(express, passport) {

    var apiFilters = [ authutils.isLoggedIn ];
    var router = express.Router();
    var MongoDBClass    = require('../models/class');

    router.post('/', apiFilters,  function (req, res){

        var data = req.body;
        data.user = req.user._id;
        var newObject = new MongoDBClass(data);

        newObject.save(function(err) {
            if (err) {
                console.log("Failed to save object: ", newObject);
            }
            MongoDBClass.findOne({_id : newObject._id})
                .populate('class')
                .exec(function(err, result){
                    // If schema options are set we seek to populate the
                    // returned schema. If not, just return as as.
                    if(MongoDBClass.options !== undefined) {
                        Class.populate(result, MongoDBClass.options, function (err, result) {
                            res.send(result);
                        });
                    } else {
                        res.send(result);
                    }
                });
        })
    })

    router.get('/', apiFilters,  function (req, res){
        MongoDBClass.find({})
            .exec(function(err, result){
                // If schema options are set we seek to populate the
                // returned schema. If not, just return as as.
                if(MongoDBClass.options !== undefined) {
                    Class.populate(result, MongoDBClass.options, function (err, result) {
                        res.send(result);
                    });
                } else {
                    res.send(result);
                }
            });
    });

    return router;

}