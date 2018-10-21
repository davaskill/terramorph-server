var authutils               = require('../utils/authutils');

module.exports = function(express, passport) {

    var apiFilters = [ authutils.isLoggedIn ];
    var router = express.Router();
    var MongoDBItem    = require('../models/particleSystem');

    router.get('/', apiFilters,  function (req, res){
        MongoDBItem.find()
            .exec(function(err, result){
                res.send(result);
            });
    });

    return router;

}