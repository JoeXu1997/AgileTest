let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var User = require('../models/users');
var Movie = require('../models/movies')
var flag  ;
var mongodbUri ='mongodb://joe:a123456@ds149479.mlab.com:49479/moviedb';//normal db
//var mongodbUri ='mongodb://joe:a123456@ds149593.mlab.com:49593/dbtest'   //used for test
mongoose.connect(mongodbUri);
//mongoose.connect('mongodb://localhost:27017/moviedb');
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});
/* GET users listing. */
router.getusers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    User.findOne({"username":req.body.operator},function (err,user) {
        if(user.usertype==="admin"){
            User.find(function(err, users) {
                if (err){
                    res.send({ message: 'No Such User!', errmsg : err });
                }else
                    res.send(JSON.stringify(users, null, 5));

            });
        } else
            res.send({message:"You donnot have right to do this operation!"})
    })
};
router.getMy=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    User.findOne({"username":req.body.operator},function (err,user) {
        if (err){
            res.send({ message: 'No Such User!', errmsg : err });
        }else
            res.send(JSON.stringify(user, null, 5));
    })
};
router.getUserWithUpvotefor = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    User.find({ "actions.upvotefor" : req.params.upvotefor },function(err, user) {
        if (err)
            res.send({ message: 'No Users Vote for this Movie!', errmsg : err });
        else
            res.send(JSON.stringify(user,null,5));
    });
};
router.addUpvote = (req,res)=>{//{"operator":"","votefor":"Roman Holiday"}
    res.setHeader('Content-Type', 'application/json');
    User.findOne({"username":req.body.operator},function (err,user) {
        if(user.actions.upvotefor===""){
            user.actions.upvotefor=req.body.votefor;
            user.save(function(err) {
                if (err)
                    res.json({ message: 'Vote Failed!', errmsg : err });
                else
                    res.json({ message: 'Vote Successful!',data:user});
            });
            Movie.findOne({"name":req.body.votefor},function (err,movie) {
                movie.upvotes+=1;
                movie.save();
            })
        }else
            res.send({message:"Each user could vote for only one movie"})
    })
}
router.getUserWithCommentfor = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');

    User.find({ "actions.comment.commentfor" : req.params.commentfor},function(err, user) {
        if (err)
            res.send({ message: 'No Users Comment this Movie!', errmsg : err });
        else
            res.send(JSON.stringify(user,null,5));
    });
};
router.changepw = (req,res) =>{
    User.findOne({"username":req.body.operator},function (err,user) {
        if(user !=null){
            user.password=req.body.newpw;
            user.save();
            res.send({ message:"Change Successfully", data : user });
        }else
            res.send({ message:"Change Failed! No Such User!"});
    })

};

router.removeOneUser = (req,res) =>{    //{"operatot":xx}

    User.findOne({"username":req.body.operator},function (err,user) {
        if(user.usertype==="admin"){
            User.findByIdAndRemove(req.params.id, function (err) {
                if (err)
                    res.json({message: "Delete Failed", errmsg: err})
                else
                    res.json({message: "Delete Successful",data:user})
            });
        }else
            res.send({message:"You donot have this authority"})
    });
};

//{"operator":xx,"username": "joe",    "password": "joe123",    "actions": {       "upvotefor": "Roman Holiday",       "comment":{         "commentfor":["Roman Holiday"],        "content":["great romance movie"]     }   } }
router.addUser = (req,res)=>{
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.usertype = req.body.usertype;

    user.save(function(err) {
        if (err)
            res.json({ message: 'User Add Failed!', errmsg : err });
        else
            res.json({ message: 'User Add Successful!',data:user});
    });
};


// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });

module.exports = router;
