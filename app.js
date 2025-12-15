const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require('http');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit')


//set view engine

dotenv.config();
app.set('view engine', 'ejs');

// connect Database
const sequelize = new Sequelize(
    process.env.DB_NAME || 'trpg_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('MySQL DB connected');
    })
    .catch((err) => {
        console.log('MySQL connection error:', err);
    });

// Export sequelize for models to use
global.sequelize = sequelize;

//import routes
const authRoute = require("./routes/auth");
const TRPGSessionRoute = require('./routes/TRPGSession');
const TRPGSheetRoute = require('./routes/TRPGSheet');
const ImageRoute = require('./routes/Image');

// middleware


const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:2100',
        'https://trpgtoaster.net',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN'],
}

app.use(rateLimit({
    windowMs: 60*1000,
    max: 350
}))
app.use(cors(corsOptions));
// route middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use("/api/user", authRoute);
app.use('/api/session', TRPGSessionRoute);
app.use('/api/sheet', TRPGSheetRoute);
app.use('/api/image', ImageRoute);

app.all('*', function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=604800')
    next();
})
const SSRRouter = require('./utils/SSRRouter')
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*',SSRRouter,function (req,res,next){
    res.render('index',{title:req.title})
    next()
})

// start server
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors:corsOptions,
});

var connect_num = 0;

io.on('connection', (socket) => {
    connect_num++;
    process.stdout.write(`\r${connect_num} people is now online.`)
    require('./utils/sheetSocket')(socket);
    require('./utils/sessionSocket')(socket);
    socket.on('disconnect', () => {
        connect_num--;
        process.stdout.write(`\r${connect_num} people is now online.`)
    })
})

server.listen(port, () => console.log('HTTP start on port:' + port));

