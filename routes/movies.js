let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Movie = require('../models/movies');
// mongoose.connect('mongodb://localhost:27017/moviedb');

var mongodbUri ='mongodb://joe:a123456@ds149479.mlab.com:49479/moviedb';//necessary
mongoose.connect(mongodbUri);
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.addMovie = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var movie = new Movie();
    movie.name = req.body.name;
    movie.movietype = req.body.movietype;
    movie.Directedby = req.body.Directedby;
    movie.mainActor = req.body.mainActor;

    movie.save(function(err) {
        if (err)
            res.json({ message: 'Movie Add Failed!', errmsg : err });
        else
            res.json({ message: 'Movie Add Successful!',data:movie});
    });
}
// function getByValue(array, id) {
//     var result  = array.filter(function(obj){return obj.id == id;} );
//     return result ? result[0] : null; // or undefined
// }
router.getMoviesByType = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Movie.find({ "movietype" : req.params.movietype },function(err, movie) {
        if (err)
            res.send({ message: 'Donation NOT Found!', errmsg : err });
        else
            res.send(JSON.stringify(movie,null,5));
    });
};
router.getMoviesByActor = (req, res) => {         //reference http://www.w3school.com.cn/jsref/jsref_obj_regexp.asp
    res.setHeader('Content-Type', 'application/json');
    var query={};
    if(req.params.mainActor) {
        query['mainActor']=new RegExp(req.params.mainActor);//模糊查询参数
    }
    console.log(query);
    Movie.find(query,function(err, movie){
        if (err){
            res.send({ message: 'No Such Movies!', errmsg : err });
        }
        else{
            res.send(JSON.stringify(movie,null,5));
        }
    });

   //  var keyword = req.params.mainActor; //从URL中传来的 keyword参数
   //  var reg = new RegExp(keyword, 'i');
   //  console.log(reg);
   // // var whereStr = {'mainActor':{$regex:reg}};
   //  Movie.findByName(reg,function(err, movie) {
   //      if (err){
   //          res.send({ message: 'No Such Movies!', errmsg : err });
   //      }
   //      else{
   //          res.send(JSON.stringify(movie,null,5));
   //      }
   //  });
};
router.getMoviesByDirector = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    var query={};
    if(req.params.Directedby) {
        query['Directedby']=new RegExp(req.params.Directedby);//模糊查询参数
    }
    console.log(query);
    Movie.find(query,function(err, movie){
        if (err){
            res.send({ message: 'No Such Movies!', errmsg : err });
        }
        else{
            res.send(JSON.stringify(movie,null,5));
        }
    });
};

router.rankformovies = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Movie.find({}).sort({upvotes : 'desc'}).exec((err, movies)=>{
        if (err)
            res.send(err);

        res.send(JSON.stringify(movies,null,5));
    });
};
router.removeMovie = (req, res) => {

    Movie.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({message:"Delete Failed",errmsg:err})
        else
            res.json({message:"Delete Successful"})
    });
}
router.upvote = (req, res) => {

    Movie.findById(req.params.id, function(err,movie) {
        if (err)
            res.json({message:"Upvote Not Found",errmsg:err});
        else {
            movie.upvotes += 1;
            movie.save(function (err) {
                if (err)
                    res.json({message:"Upvote failed",errmsg:err});
                else
                    res.json({message:"Upvote Successful",data:movie});
            });
        }
    });
}

// router.upvote = (req, res) =>{
//     var id = req.params.id;
//     var findresult= getByMovieID(movies,req.params.id);
//     if(findresult != null){
//         findresult.upvotes +=1;
//         //res.json({status : 200, message : 'UpVote Successful' , donation : donation });
//         res.send(JSON.stringify(findresult,null,5));
//     }else
//         res.send("No matching result");
//
// }
// router.getAll = (req,res) =>{
//     res.send(JSON.stringify(movies,null,5));
// };
// router.getTypeMovies = (req,res) =>{
//     var findresult = getMoviesByType(movies,req.params.movietype);
//     if(findresult != null)
//         res.send(JSON.stringify(findresult,null,5));
//     else
//         res.json({Error: "No matching results"});
// };
// router.getActorMovies = (req,res) =>{
//     var findresult = getMoviesByActor(movies,req.params.mainActor);
//     if(findresult != null)
//         res.send(JSON.stringify(findresult,null,5));
//     else
//         res.json({Error: "No matching results"});
// };
// router.getDirectorMovies = (req,res) =>{//模糊查询和mongo一起
//     var findresult = getMoviesByDirector(movies,req.params.Directedby);
//     if(findresult != null)
//         res.send(JSON.stringify(findresult,null,5));
//     else
//         res.json({Error: "No matching results"});
// };
// function getMoviesByType(array,type){
//     let result = [];
//     array.forEach(function (obj) {
//        if(obj.movietype.toLowerCase() == type.toLowerCase())
//            result.push(obj);
//     });
//     return result;
// }
// function getMoviesByActor(array,actor){
//     let result = [];
//     array.forEach(function (obj) {
//         if(obj.mainActor.toLowerCase().indexOf(actor.toLowerCase()) !=-1 )
//             result.push(obj);
//     });
//     return result;
// }
// function getMoviesByDirector(array,director){
//     let result = [];
//     array.forEach(function (obj) {
//         if(obj.Directedby.toLowerCase().indexOf(director.toLowerCase()) != -1 )
//             result.push(obj);
//     });
//     return result;
// }
// function getByMovieID(array, id) {
//     var result  = array.filter(function(obj){return obj.id == id;} );
//     return result ? result[0] : null; // or undefined
// }
// router.addMovie  =(req,res) =>{// wrong with show
//     var id = movies.length+1000;
//     var currentSize = movies.length;
//     movies.push( {id: id, name:req.params.name,  movietype: req.params.movietype, Directedby:req.params.Directedby,
//         mainActor:req.params.mainActor, upvotes: 0});
//     if((currentSize + 1) == movies.length)
//         res.json({ message: 'Donation Added!'});
//     else
//         res.json({ message: 'Donation NOT Added!'});
// }
module.exports = router;