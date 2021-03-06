var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    rp = require('request-promise');

keys = ['373a612eeeae2813e001680f04b585db',
        '5dbe8dc691de2b3d8db331019416a9e5']
currentKeyId = 0;
loop = false;

// TODO: IPHOEN
// TODO: OVERFLOW

function checkKey(query, cb) {
    rp(query+'&key='+keys[currentKeyId])
        .then(function (htmlString) {
            cb(htmlString);
        })
        .catch(function () {
            key_id += 1;
            if (key_id > keys.length-1) {
                cb('we ran outta keys');
            }
            checkKey(query, cb);
        });
}

var templates_dir = __dirname+'/templates/';
var static_dir = __dirname+'/static/';

var app = express();
app.use(express.static(static_dir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function (req, res){
    res.sendFile(templates_dir+'landing.html');
});
app.get('/index', function (req, res){
    res.sendFile(templates_dir+'index.html');
});
app.post('/getRecipes', function (req, res) {
    dict = req.body;
    var food = dict['ingredient_0'];
    checkKey('http://food2fork.com/api/search?q='+food,function (response) {
        res.send(response);
    });
});
app.post('/getIngredients',function (req, res) {
    id = req.body['rId']
    checkKey('http://food2fork.com/api/get?rId='+id, function (response) {
        res.send(response);
    });
});

app.use(function (req,res) {
    res.status(404).sendFile(templates_dir+'404.html');
});

app.listen(process.env.PORT || 5000);
