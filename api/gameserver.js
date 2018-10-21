var authutils               = require('../utils/authutils');
var config                  = require('../config/gameserver');
var StringUtils             = require('../utils/stringutils');
var MongUser                = require('../models/user');

module.exports = function(express, passport) {

    var apiFilters = [ authutils.isLoggedIn ];
    var router = express.Router();

    router.get('/finder', apiFilters,  function (req, res){

        const data = {
            socketAddress : config.hostName + ':' + config.webSocketPort,
            _id : req.user._id,
            token : StringUtils.randomString(128),
        }
        MongUser.findOne({ _id : data._id }, function (err, doc){
            doc.token = data.token;
            doc.save();
        });

        res.json(data);
    });

    return router;
}