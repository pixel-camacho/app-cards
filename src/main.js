const express =  require('express');
const morgan =  require('morgan');
const path = require('path');
const exphbs =  require('express-handlebars');
const { urlencoded } = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore =  require('express-mysql-session');
const {database} =  require('./keys');
const passport = require('passport');


// initializations
const app =  express();
require('./lib/passport');

// Setting
app.set('port',process.env.PORT || 4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handdlebars')
}));
app.set('view engine', '.hbs');

//middleware
app.use(session({
        secret: 'dallanbambipost',
        resave: false,
        saveUninitialized: false,
        store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) =>{
   app.locals.success =  req.flash('success');
   app.locals.message = req.flash('message');
   app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/autentication.routes'));
app.use('/links',require('./routes/links.routes'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), (req, res)=>{
    console.log('Server on port: ',app.get('port'));
});
