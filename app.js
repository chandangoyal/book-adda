// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
var express  = require('express');
var app      = express();
var aws = require('aws-sdk');                               // 
var mongoose = require('mongoose');
var multer = require('multer');// mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-1';
// configuration =================

//mongoose.connect('mongodb://127.0.0.1:27017');
//mongoose.Promise = global.Promise

//mongoose.connect(uri);

//var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error:'));connect to mongoDB database on modulus.io
mongoose.connect('mongodb://chandangoyal:chandangoyal111@ds035603.mlab.com:35603/bookdetails');
app.use(express.static(__dirname + '/public',{index:'index2.html'}));
process.env.PWD = process.cwd()

// Then
//app.use(express.static(process.env.PWD + '/public'));
app.use(express.static(__dirname + '/upload'));// set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
var a,b,c,d;
var imageSchema = mongoose.Schema({
    path: {
        type: String,
        //required: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    type:  {
      type: String
    },
    contact:   {
      type: String
    },
user:{
        required:true,
      type:String
},
price:{
    type:String
},
author:{
    type:String
},
    location:{
        type:String
    }
});
var newUser = mongoose.Schema({
    name: {
        type: String,
        //required: true,
    },
    email: {
        type: String,
        required: true
    }}
    );
var bool=false;
var Todo = mongoose.model('Todo',imageSchema);
var User = mongoose.model('User',newUser);
// listen (start app with node server.js) ======================================
app.listen(process.env.PORT || 3000);
app.get('/sign-s3', (req, res) => {
console.log(req.query['file-name']);
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
console.log("2nd step");
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
console.log("third step");
    res.write(JSON.stringify(returnData));
    res.end();
  });
});
app.get('/api/todos', function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(todos);
        // return all todos in JSON format
    });
});
app.get('/api/latest', function(req, res) {
    //Todo.find().sort({_id:1}).limit(50);
    // use mongoose to get all todos in the database
    var query2={path:{ $ne:null}}
   Todo.find(query2,function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(todos);
        // return all todos in JSON format
    }).sort({_id:-1}).limit(10);
});
/*var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function(req, file, cb) {
        var datetimestamp = b;
        //a="uploads/"+file.fieldname+datetimestamp+".jpg";

        cb(null, datetimestamp+".jpg");
    }
});
var upload = multer({
    storage: storage
});*/

app.post('/', function(req, res, next) {
    res.redirect('/');
});

app.post('/api/todos', function(req, res,next) {
//console.log(req.body.file.data);
    //console.log(a);
    if(req.body.bool==true) {
        b = Date.now();
        a = b + ".jpg";
    }
    else
        a=null;
    // create a todo, information comes from AJAX request from Angular
   Todo.create({
        title : req.body.tittle,
        //path:   "uploads/myimage"+Date.now(),
       path:req.body.path,
       user:req.body.user,
       author:req.body.author,
       price:req.body.price,
        type:   req.body.type,
        contact:req.body.contact,
       location:req.body.location,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
    });
   bool=false;
res.send("done");
//    res.sendfile('./public/index.html');
});
app.post('/api/find', function(req, res) {
    //console.log(req.body.contact);
    var query = { '$or':[{title:  {'$regex':req.body.search, '$options' : 'i'}},{type:{'$regex':req.body.search, '$options' : 'i'}}
    ,{author:{'$regex':req.body.search, '$options' : 'i'}},{location:{'$regex':req.body.search, '$options' : 'i'}}] };
    Todo.find(query,function(err, todos) {
        if (err)
            res.send(err)
        res.json(todos);
    }).sort({_id:-1});
});

app.post('/api/findcart', function(req, res) {
    //console.log(req.body.contact);
    var query = {user: req.body.user};
    Todo.find(query, function (err, todos) {
        if (err)
            res.send(err)
        res.json(todos);
    }).sort({_id: -1});

});

app.get('/api/findalladmin', function(req, res) {
    Todo.find(function(err, todos) {
        if (err)
            res.send(err)
        res.json(todos);
    }).sort({_id:-1});
});

app.get('/api/getallusers', function(req, res) {
    //console.log(req.body.contact);
    //var query = {type:{'$nin':["Engineering","Management","Competitive","Novel","General Knowledge"]}};//{'$regex':, '$options' : 'i'} };
    User.find(function(err, todos) {
        if (err)
            res.send(err);
        res.json(todos);
    }).sort({_id:-1});


});

app.post('/api/findall', function(req, res) {
    //console.log(req.body.contact);
    //{path:{ $ne:null}}
    var query = {type:{'$nin':["Engineering","Management","Competitive","Novel","General Knowledge"]}};//{'$regex':, '$options' : 'i'} };
    Todo.find(query,function(err, todos) {
        if (err)
            res.send(err)
        res.json(todos);
    }).sort({_id:-1});
});

app.post('/api/joingoogle', function(req, res,next) {
    var query = { email:req.body.emailid };
    //var r;
    //check=true;
    User.findOne(query,function(err, result) {
        if (err)
            res.send(err)
        if(result){
            res.send("Done");
        }
        else{

            User.create({
                name: req.body.uname,
                email: req.body.emailid
            }, function (err, todo) {
                if (err)
                    res.send(err);

                // get and return all the todos after you create another
            });
            res.send("You are Registered");
        }

    });

});

app.post('/api/join', function(req, res,next) {
    var query = { email:req.body.emailid };
    //var r;
    //check=true;
    User.findOne(query,function(err, result) {
        if (err)
            res.send(err)
        if(result){
            res.send("This emailid is already Registered! Please Login.");
        }
        else{

            User.create({
                name: req.body.uname,
                email: req.body.emailid
            }, function (err, todo) {
                if (err)
                    res.send(err);

                // get and return all the todos after you create another
            });
            res.send("You are Registered");
             }

    });

});

app.post('/api/signin', function(req, res,next) {
    var query = { email:req.body.emailid };
    User.findOne(query,function(err, result) {
        if (err)
            res.send(err)
        if(result){
            res.send(result);
        }
        else{
            res.send("Your emailid is not recognized!Please try again.");
        }

    });

});
// delete a todo
app.post('/api/delete', function(req, res) {
    Todo.remove({
        user: req.body.user,
        title:req.body.title
    }, function (err, todo) {
        if (err)
            res.send(err);

    });
    res.send("deleted")

});
app.post('/api/deleteuser', function(req, res) {
    User.remove({
        name: req.body.uname,
        email:req.body.emailid
    }, function (err, todo) {
        if (err)
            res.send(err);

    });
    res.send("userdeleted")

});

app.get('/', function(req, res) {
    res.sendfile('public/index2.html'); // load the single view file (angular will handle the page changes on the front-end)
});