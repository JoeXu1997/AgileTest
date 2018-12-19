// const movies = [
//     {id: 1000, "name":"Inception", "movietype": "ScienceFiction", "Directedby":"Christopher Nolan","mainActor":"Leonardo DiCaprio", upvotes: 203},
//     {id: 1001, "name":"Roman Holiday", "movietype": "Romance","Directedby":"William Wyler", "mainActor":"Audrey Hepburn", upvotes: 212},
//     {id: 1002, "name":"Mission:Impossible", "movietype": "Suspense", "Directedby":"Brian Russell De Palma","mainActor":"TomCruise", upvotes: 178},
//     {id: 1003, "name":"The Conjuring", "movietype": "Horror","Directedby":"James Wan", "mainActor":"Vera Ann Farmiga", upvotes: 167},
//     {id: 1004, "name":"A Chinese Odyssey", "movietype": "Comedy", "Directedby":"ZhenWei Liu","mainActor":"XingChi Zhou", upvotes: 223},
//     {id: 1005, "name":"Civilization", "movietype": "Documentary", "Directedby":"Ashley Gething","mainActor":"null", upvotes: 139},
//     {id: 1006, "name":"The Shining ", "movietype": "Horror", "Directedby":"Stanley Kubrick","mainActor":"Jack Nicholson", upvotes: 257},
//     {id: 1007, "name":"Despicable Me", "movietype": "Children", "Directedby":"Chris Renaud & Pierre Coffin","mainActor":"Steve Carell", upvotes: 98},
//     {id: 1008, "name":"Dangal", "movietype": "Sports", "Directedby":"Nitesh Tiwari","mainActor":"Aamir Khan", upvotes: 307}
// ]
// ;{"operator":"xu","name":"The Shining", "movietype": "Horror","Directedby":"Stanley Kubrick","mainActor":"Jack Nicholson"}
//{"operator":"xu","name":"Inception", "movietype": 'ScienceFiction', "Directedby":"Christopher Nolan","mainActor":"Leonardo DiCaprio"}
// module.exports = movies;
let mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({        //  add movie description and comment ?
        name: String,
        movietype: String,
        Directedby: String,
        mainActor: String,
        description: String,
        upvotes: {type: Number, default: 0}
    },
    { collection: 'movie' });

module.exports = mongoose.model('Movie', MovieSchema);
