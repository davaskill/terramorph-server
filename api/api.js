
module.exports = function(app, express, passport) {

    var gamesever               = require('./gameserver')(express, passport);
    var admincrud               = require('./admincrud')(express, passport);
    var classApi                = require('./class')(express, passport);
    var characterApi            = require('./character')(express, passport);
    var skillApi                = require('./skill')(express, passport);
    var itemApi                 = require('./item')(express, passport);
    var effectApi               = require('./effect')(express, passport);
    var effectChainApi          = require('./effect-chain')(express, passport);

    app.use('/api/class', classApi);
    app.use('/api/character', characterApi);
    app.use('/api/skill', skillApi);
    app.use('/api/item', itemApi);
    app.use('/api/effect', effectApi);
    app.use('/api/effect-chain', effectChainApi);

    app.use('/gameserver', gamesever);
    app.use('/crud', admincrud);
}