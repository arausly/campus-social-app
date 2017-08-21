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
const cookieParser = require('cookie-parser');

require('./config/configjs');


const app = express();

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
	resave: true,
	saveUninitialized: true,
	secret: process.env.JWT_SECRET,
	store: new store({
		url:database,
		autoReconnect: true
	})
}));
app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const mainRoutes = require('./routes/main');
const userAccounts = require('./routes/user');
app.use(mainRoutes);
app.use(userAccounts);

const port = process.env.PORT;

app.listen(port, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log(`app is running on port ${port}`);
	}
})
