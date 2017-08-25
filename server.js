const express = require('express');
const expressHbs = require('express-handlebars');
const axios = require('axios');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {
	database
} = require('./config/store');
const session = require('express-session');
const store = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');
const passportSocketIo =  require('passport.socketio');
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const http = require('http');

require('./config/configjs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server)

const sessionStore = new store({url:database,autoReconnect:true});

require('./realtime/io')(io);

mongoose.connect(database);
mongoose.connection
	.once('open', () => {
		console.log('connected to database')
	})
	.on('disconnected', () => {
		console.log('disconnected from database')
	})
	.on('error', (err) => {
		console.log('Error', err)
	})


mongoose.Promise = global.Promise;

app.engine('.hbs', expressHbs({
	defaultLayout: 'layout',
	extname: "hbs"
}));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(session({
	key:'anything.sid',
	resave: true,
	saveUninitialized: true,
	secret: process.env.JWT_SECRET,
	store:sessionStore
}));
app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
	res.locals.user = req.user;
	next();
});

io.use(passportSocketIo.authorize({
	cookieParser:cookieParser,
	secret:process.env.JWT_SECRET,
	key:'anything.sid',
	store:sessionStore,
	success:oAuthSuccess,
	fail:oAuthFailed,
}))

function oAuthSuccess(data,accept){
	 console.log('Successful connection');
	accept();
}

function oAuthFailed(data,message,error,accept){
	console.log('Failed connection');
	 if(error) return accept(new Error(error));
}
const mainRoutes = require('./routes/main');
const userAccounts = require('./routes/user');
app.use(mainRoutes);
app.use(userAccounts);

const port = process.env.PORT;

server.listen(port, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log(`app is running on port ${port}`);
	}
})
