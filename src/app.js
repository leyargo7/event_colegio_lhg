require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const mysql = require('mysql');
// const myConnection = require('express-myconnection');

const session = require('express-session');


const app = express();
const port = process.env.PORT || 3000;

// importing routes
const customerRoutes = require('./routes/customer');

// settings

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//db connection
//mongoose.connect('mongodb://localhost/chatDDDB')
mongoose.connect(process.env.CONN_MONGO)
    .then(db => console.log('db is connected')) 
    .catch(err => console.log(err));


// middlewares
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({secret: 'leyGpxConnect07', resave: false, saveUninitialized: false}));

// routes
app.use('/', customerRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

//-------------------------

// starting the server
const server = app.listen(port, () => {
    console.log(`leyargo on port ${port}`);
});

//websockets
const SocketIO = require('socket.io');
const io = SocketIO(server);

require('./sockets')(io);


// view connect user

// app.get('/gpxconnect', function (req, res){
    
//     let d = UserConnected;
//     res.render('connect', {
//         d,
//         dbConexion,
//         dbDesConexion

//     });
// });


// ---------------------CONCERT GPX------------------

// app.get('/sdflErglfGtHfhlsfg2fgsf5g456fg454fgs', function (req, res){

//     res.render('GpxStream', {
        
//     });
// });



module.exports = app;
