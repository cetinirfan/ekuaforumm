var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var app = express();
var upload = require('express-fileupload');


app.engine('.ejs', ejs.__express);
app.set('views', __dirname+'/view');

app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(upload());

const db = require('./services/mongodb.js')();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('uploads'))
app.use(express.static(__dirname+'/public'))

app.use("/", require('./routes/index.js'))
app.use("/category", require('./routes/category.js'))
app.use("/operatings", require('./routes/operatings.js'))
app.use("/admins", require('./routes/admins.js'))
app.use("/users", require('./routes/users.js'))
app.use("/feedback", require('./routes/feedback.js'))
app.use("/login", require('./routes/login.js'))


var server = http.createServer(app);
server.listen(80);