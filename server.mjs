import express                   from 'express';
import http                      from 'http';
import cookieParser              from 'cookie-parser';
import bodyParser                from 'body-parser';
import expressSession            from 'express-session';
import mongoose                  from 'mongoose';
import passport                  from 'passport';
import flash                     from 'connect-flash';
import sessionMemoryStore        from 'session-memory-store';
import path                      from 'path';
import ejs                       from 'ejs';

//import url                       from 'url';
//import WebSocket                 from 'ws';
//import WebSocketServer           from 'ws'.Server;
import serverConfig              from'./config/gameserver.js';
import configDB                  from'./config/database.js';
import expose                    from './utils/expose';

const app = express();
const __dirname = expose.__dirname;

//------------------------------------------------------------------------
// Configuration
//------------------------------------------------------------------------
mongoose.connect(configDB.url);             // connect to our database

import PassportConfig from './config/passport';
PassportConfig(passport);     // pass passport for configuration


// Allow serving static content from the client dir.
app.use(express.static(path.join(__dirname, 'client/views')));
app.use(express.static(path.join(__dirname, 'client')));

app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.set('views', __dirname + '/client');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// set up our express application
// app.use(morgan('dev'));                  // log every request to the console
app.use(cookieParser());                    // read cookies (needed for auth)
app.use(bodyParser());                      // get information from html forms

// required for passport

var MemoryStore = sessionMemoryStore(expressSession);

app.use(expressSession({
    secret: 'fuckDickery',
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: 3600 * 60 * 1000},
    store: new MemoryStore()
}));                                        // session secret
app.use(passport.initialize());
app.use(passport.session());                // persistent login sessions
app.use(flash());                           // use connect-flash for flash messages stored in session

//------------------------------------------------------------------------

//------------------------------------------------------------------------
// Set up webserver
//------------------------------------------------------------------------
const server = http.createServer(app);

// Start server.
server.listen(serverConfig.webServerPort, serverConfig.ipAddress, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

/*
 app.get('/', function (){
 console.log("WHORE");
 })
 */

/*
 import EmulatedSocketServer      from'./app/gameserver/emulated-socket-server'
 )
 ;
 import MatchMaker                from'./app/gameserver/finder'
 ).
 MatchMaker;
 import socketGrouper
 = new EmulatedSocketServer.WebSocketServerGrouper(server);

 socketGrouper.register('/fiskhora/ludersnickers', new MatchMaker(socketGrouper));

 */

//--------------------------------------------------

//------------------------------------------------------------------------
// Routes
import Routes from './api/routes.js';
import API from './api/api';

API(app, express, passport);
Routes(app, passport);
//------------------------------------------------------------------------
