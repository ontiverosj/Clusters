const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')



const app = express();

//DB Config 
const db = require('./config/keys').MongoURI

//connect to Mongo 
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MONGODB Connected...'))
.catch(err => console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Parser 
app.use(express.urlencoded({extended: false}))

// express Seassion 
app.use(session({ 		//Usuage
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    
}))

//flash connection
app.use(flash());

//G vars 

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Routes 
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log('Server started on port 3000'));