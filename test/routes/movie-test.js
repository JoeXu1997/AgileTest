let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let User = require('../../models/users');
let Movie = require('../../models/movies');
chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));
var id;
describe('Movie API', function (){
    Movie.collection.drop();
    beforeEach(function(done){
        var newMovie = new Movie({
            name:"A Chinese Odyssey",
            movietype: 'Comedy',
            Directedby:"ZhenWei Liu",
            mainActor:"XingChi Zhou",
            upvotes: 1
        });
        var newMovie1 =  new Movie({
            name:"Roman Holiday",
            movietype: 'Romance',
            Directedby:"William Wyler",
            mainActor:"Audrey Hepburn"
        });
        newMovie1.save(function(err) {
            done();
            newMovie.save();
        });
    });
    afterEach(function(done){
        Movie.collection.drop();
        done();
    });
    describe("GET functions",function () {
        describe('GET /movies',  function(){
            before(function (done) {
                var newMovie2 = new Movie({
                    name:"Mission:Impossible",
                    movietype: 'Suspense',
                    Directedby:"Brian Russell De Palma",
                    mainActor:"TomCruise"
                });
                newMovie2.save(done);
            })
            it('should return all the movies in an array ordered by upvotes', function(done) {
                chai.request(server)
                    .get('/movies')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);
                        done();
                    });
            });
        });
        describe('GET /movies/actor/:mainActor',function () {
            it('should return movies which has someone as actor ', function(done) {
                chai.request(server)
                    .get('/movies/actor/Hepburn')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0]).to.have.property("name").equal("Roman Holiday");
                      //  expect(res.body[0]).to.have.property("name").equal("made");
                        done();
                    });
            });
            it('should return empty array if there is no matching result', function (done) {
                chai.request(server)
                    .get('/movies/actor/Audaarey')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(0);
                        done();
                    });
            });
        });
        describe('GET /movies/director/:Directedby',function () {
            it('should return movies which has someone as director', function(done) {
                chai.request(server)
                    .get('/movies/director/Liu')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(1);
                       // expect(res.body[1]).to.have.property("name").equal("made");
                        expect(res.body[0]).to.have.property("name").equal("A Chinese Odyssey");
                        done();
                    });
            });
            it('should return empty array if there is no matching result', function (done) {
                chai.request(server)
                    .get('/movies/director/Liuaaaa')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(0);
                        done();
                    });
            });
        });
        describe('GEt /movies/:movietype',function () {
            it('should return movies according to types ', function(done) {
                chai.request(server)
                    .get('/movies/Comedy')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0]).to.have.property("name").equal("A Chinese Odyssey");
                        done();
                    });
            });
            it('should return empty array if no matching results ', function(done) {
                chai.request(server)
                    .get('/usr/upvote/asd')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(0);
                        done();
                    });
            });
        });
    });
    describe('POST functions',function () {
        describe('POST /movies', function () {
            it('should return success message and update database(add a new movie)', function(done) {
                let movie = {
                    "name": "test",
                    "movietype": "Horror",
                    "Directedby": "me",
                    "mainActor":"me"
                }
                chai.request(server)
                    .post('/addmoviestest')
                    .send(movie)
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Movie Add Successful!');
                        done();
                    });
            });
            afterEach(function  (done) {
                chai.request(server)
                    .get('/movies')
                    .end(function(err, res) {
                        let result = _.map(res.body, (movie) => {
                            return { name: movie.name,
                                movietype: movie.movietype,
                                Directedby:movie.Directedby,
                                mainActor:movie.mainActor};
                        }  );
                        expect(result[2]).to.include( {
                            name: "test",
                            movietype: "Horror",
                            Directedby: "me",
                            mainActor:"me"  } );
                        done();
                    });
            });  // end-after
        });
    });
    describe.only('PUT functions',function () {
        describe('PUT /movies/:id', () => {
            it('should return success message and add 1 to movie upvotes', function(done) {
                var newUser1 = new User({
                    username: 'yue',
                    password: '123456',
                    usertype: 'admin',
                    actions:{
                        upvotefor:"",
                        comment:{
                            commentfor:[],
                            content:[]
                        }
                    }
                });
                newUser1.save();
                Movie.findOne({"name":"A Chinese Odyssey"},function (err,movie) {
                    id=movie._id;
                    done();
                });
                chai.request(server)
                    .put('/movies/'+id)
                    .send({"operator":"yue"})
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal("Upvote Successful");
                        let movie = res.body.data ;
                        expect(movie).to.have.property('upvotes').equal(2);
                        done();
                    });
            });
            it('should failed message if the operator already vote for other movies', function(done) {
                var newUser = new User({
                    username: 'xu',
                    password: '123456',
                    usertype: 'admin',
                    actions:{
                        upvotefor:"Inception",
                        comment:{
                            commentfor:["Inception"],
                            content:["Good Film"]
                        }
                    }
                });
                newUser.save();
                Movie.findOne({"name":"A Chinese Odyssey"},function (err,movie) {
                    id=movie._id;
                    done();
                });
                chai.request(server)
                    .put('/movies/'+id)
                    .send({"operator":"xu"})
                    .end(function(err, res) {
                        expect(res.body).to.have.property('message').equal("Each user could only vote for one movie");
                        done();
                    });
            });
        });
    });
    // describe('DELETE /usr/:id',() => {
    //     beforeEach(function (done) {
    //         User.find(function (err,users) {
    //             id =users[0]._id;
    //             done();
    //         })
    //     })
    //     it('should return a message and delete a user record', function (done) {
    //         chai.request(server)
    //             .delete('/usr/'+id)
    //             .send({"operator":"xu"})
    //             .end(function (err, res) {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.have.property('message',  "Delete Successful");
    //                 let user = res.body.data;
    //                 expect(user.username).is.to.equal("xu");
    //                 done();
    //             });
    //     });
    // });
});