var authutils           = require('../utils/authutils');
var MongoDBSkill        = require('../models/skill');

module.exports = function(express) {

    var apiFilters = [ authutils.isLoggedIn ];
    var router = express.Router();

    router.get('/', apiFilters,  function (req, res){
        MongoDBSkill.find()
            .exec(function(err, result){
                    res.send(result);
            });
    });

    return router;
}