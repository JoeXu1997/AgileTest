let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Comment = require('../models/comment');
var User = require('../models/users');
// var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
//     replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
//     user: 'JoeXu', pass: 'xuyue.is.me1314' };

//var mongodbUri = 'mongodb://joe:a123456@ds039768.mlab.com:39768/heroku_hqk5v3sf';
//var mongooseUri = uriUtil.formatMongoose(mongodbUri);

var mongodbUri ='mongodb://joe:a123456@ds149479.mlab.com:49479/moviedb';//normal db
//mongoose.connect(mongodbUri);
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

router.getCommentByMovieName = (req,res)=>{ // comment/movie?moviename=Inception
    res.setHeader('Content-Type', 'application/json');//query 不行？
    Comment.find({"commentfor":req.params.commentfor},function (err,comments) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(comments,null,5));
    })
};

router.getcomments = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Comment.find(function(err, comments) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(comments,null,5));
    });
};
router.addOneComment = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    var comment = new Comment();
    comment.username = req.body.username;
    comment.commentfor = req.body.commentfor;
    comment.content = req.body.content;

    comment.save(function(err) {
        if (err)
            res.json({ message: 'Comment Add Failed!', errmsg : err });
        else
            res.json({ message: 'Comment Add Successful!',data:comment});
    });
}
router.addcomment = (req,res)=>{  //{"username":"joe","commentfor":"Inception","content":"Nice film"}
    res.setHeader('Content-Type', 'application/json');
    var comment = new Comment();
    comment.username = req.body.username;
    comment.commentfor = req.body.commentfor;
    comment.content = req.body.content;

    comment.save(function(err) {
        if (err)
            res.json({ message: 'Comment Add Failed!', errmsg : err });
        else
            res.json({ message: 'Comment Add Successful!',data:comment});
    });
    User.findOne({"username":req.body.username},function (err,user) {
        if (err)
            res.json({message:"User Not Found",errmsg:err});
        else {
            user.actions.comment.commentfor.push(req.body.commentfor);
            user.actions.comment.content.push(req.body.content);
            user.save();
        }
    });

};
router.editComment=(req,res)=>{//params + body  {"content":"new content","commentfor":""}
    res.setHeader('Content-Type', 'application/json');
    var newcontent = req.body.content;            //想要的新评论
    var newcommentfor = req.body.commentfor;

    Comment.findById(req.params.id,function (err,comment) {
        if (err)
            res.json({message:"Update failed",errmsg:err});
        else{
            editUsrComment(comment.username,comment.commentfor,comment.content,newcommentfor,newcontent);
            comment.commentfor=newcommentfor;
            comment.content=newcontent;
            comment.save(function () {
                res.json({message:"Update Successful",data:comment});
            });
        }
    });
};
function editUsrComment(username,commentfor,content,newcommentfor,newcontent){
    console.log(username+" "+commentfor+" "+content);
    console.log(newcommentfor+" "+newcontent);
    // User.update({"username":username,"actions.comment.commentfor":commentfor,"actions.comment.content":content}, {"actions.comment.commentfor":newcommentfor,"actions.comment.content":newcontent}, function(){
    //    console.log("success")
    // });
    User.findOne({"username":username},function (err,user) {
        for(var i=0;i<user.actions.comment.commentfor.length;i++){
            if(user.actions.comment.commentfor[i]===commentfor && user.actions.comment.content[i]===content){
                console.log("in if")
                user.actions.comment.commentfor.splice(i,1,newcommentfor);
                user.actions.comment.content.splice(i,1,newcontent);
                user.save();
                console.log(user.actions.comment+"1")
            }
        }
    });
}
router.getUserComment = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    Comment.find({"username":req.params.username},function (err,comment){
        if (err)
            res.send({ message: 'This Users didnot Comment this Movie!', errmsg : err });
        else
            res.send(JSON.stringify(comment,null,5));
    });
};
router.getOneComment = (req,res)=>{//回调函数是在router方法体运行完之后在执行。
    res.setHeader('Content-Type', 'application/json');
    Comment.findById(req.params.id,function (err,comment) {
        if (err)
            res.send({ message: 'Comment NOT Found!', errmsg : err });
        else
            res.send(JSON.stringify(comment, null, 5));

    });
}
router.removeComment = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');

    Comment.findByIdAndRemove(req.params.id, function(err,comment) {
        if (err)
            res.json({message:"Delete Failed",errmsg:err})
        else {
            res.json({message: "Delete Successful",data:comment});
        }
    });
};
function removeUsrComment(username,commentfor,content){
    console.log("in remove")
    User.findOne({"username":username},function (err,user) {
        console.log(user.actions.comment.commentfor.length);
        for(var i=0;i<user.actions.comment.commentfor.length;i++){
            console.log(user.actions.comment.content);
            if(user.actions.comment.commentfor[i]===commentfor && user.actions.comment.content[i]===content){
                console.log("in if")
                user.actions.comment.commentfor.splice(i,1);
                user.actions.comment.content.splice(i,1);
                user.save();
            }
        }
    });
}

module.exports = router;
