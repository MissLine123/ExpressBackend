var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine', 'ejs');

require('dotenv').config();


var User = require('./modeles/User');
var form = require('./modeles/formulaire');

const Film = require('./modeles/Film');
const Post = require('./modeles/Post');
const url =process.env.DATABASE_URL;

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(console.log("MongoDB connected"))
.catch(err => console.log(err));

// app.get("/", function (req, res) {
//     // res.sendFile("C:/Users/lagra.STAGIAIRE-02/Desktop/Frederic/Nouveaudossier/expressBackend/formulaire.html");
//     res.sendFile(path.resolve("formulaire.html"));
// })

app.post("/submit-data", function (req, res) {
    console.log(req.body);
    var name = req.body.prenom + "  " + req.body.nom;

    res.send(name + " submited successfully");
});
app.get("/contact", function (req, res) {
    res.sendFile(path.resolve("contact.html"));
});

// app.post("/submit-contact", function (req, res) {
//     console.log(req.body);
//     var name = req.body.nom +  " " + req.body.prenom
//     var email = req.body.email
//     res.send("Bonjour " + name + ", <br>Merci de nous avoir contacté. <br>Nous reviendrons vers vous dans les plus bref délai à cette adresse : " + email );})


//CONTACT ROUTES    
app.post("/submit-contact", function (req, res) {
    const Data = new form({
        prenom : req.body.prenom,
        nom : req.body.nom,
        age : req.body.age,
        message : req.body.message,
        email : req.body.email
});
Data.save().then(()=>{
    res.redirect('/')
}).catch(err => console.log(err));
});  
app.get('/', function(req, res){
    form.find().then(data => {
       console.log(data);
        res.render('Home', {data: data});
    })

})

app.get('/contact/:id', function(req, res){
    
    form.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Edit', {data:data})
    }).catch(err =>{ console.log(err)});
});

app.put('/contact/edit/:id', function (req, res) {
    const Data = new form({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
      });
      form.updateOne({
        id: req.params.id}, Data).then(
        () => {
        console.log("updated contact!");
        res.redirect('/')
        }
      ).catch (err => console.log(err));
})

app.delete('/contact/delete/:id', function(req, res){
    form.findOneAndDelete({
        _id: req.params.id,
    }).then(() => {
        console.log("Data deleted")
        res.redirect('/');
    }).catch(err => console.log(err));
})
//END CONTACT ROUTES
//----------------------------------------------------------------

//FILM ROUTES
app.get('/newfilm', function(req, res){
    res.render('NewFilm');
});


app.post('/submit-film', function(req, res){
    const Data = new Film({
       titre: req.body.titre,
       genre: req.body.genre,
       nb_ventes: req.body.nb_ventes,
       poster: req.body.poster,
       
   } )
   Data.save().then(()=>{
    console.log("Film ajouté");
    res.redirect('/newfilm')
    
    }).catch(err => {console.log(err)});;
});

app.get('/allfilm', function(req, res){
    Film.find().then((data) => {
     
        res.render('Allfilm', {toto: data});
    })

})
app.get('/film/:id', function(req, res){
    Film.findOne({
       _id: req.params.id})
       .then(data => { res.render('EditFilm', {film:data});})
       .catch(err =>{ console.log(err)});
   });

app.delete('/film/delete/:id', function (req, res) {
    console.log("test");
    Film.findOneAndDelete({
        _id: req.params.id
    }).then(() => { console.log("Data deleted successfully");
    res.redirect('/allfilm');
     }).catch(err => {console.log(err)});
});

//POST ROUTES
app.get('/newpost', function(req, res){
    res.render('NewPost');
});

app.post('/submit-post', function(req, res){
    const Data = new Post({
       titre: req.body.titre,
       soustitre: req.body.soustitre,
       para: req.body.para,
      
       
   } )
   Data.save().then(()=>{
    console.log("Post ajouté");
    res.redirect('/allpost')
    
    }).catch(err => {console.log(err)});;
});
app.get('/allpost', function(req, res){
    Post.find().then((data) => {
     
        res.render('Allpost', {data: data});
    })

})
app.get('/post/:id', function(req, res){
    Post.findOne({
       _id: req.params.id})
       .then(data => { res.render('PostEdit', {data:data});})
       .catch(err =>{ console.log(err)});
   });
app.delete('/post/delete/:id', function (req, res) {
    console.log("test");
    Post.findOneAndDelete({
        _id: req.params.id
    }).then(() => { console.log("Data deleted successfully");
    res.redirect('/allpost');
     }).catch(err => {console.log(err)});
});
app.put('/post/edit/:id', function (req, res) {
    const Data = new Post({
        titre: req.body.titre,
    }).Post.updateOne({
        id: req.params.id}, Data).then(
        () => {
        console.log("updated contact!");
        res.redirect('/')
        }
      ).catch (err => console.log(err));;
});
app.put('/post/edit/:id', function (req, res) {
    const Data = {
        titre: req.body.titre,
        soustitre: req.body.soustitre,
        para: req.body.para,
       
        
    } ;
    Post.updateOne({
        id: req.params.id}, {$set : Data})
        .then((data) => {
            console.log(data);
            res.redirect('/allpost');
    }).catch(err => console.log(err));
})
//---------------------------------------------------------------------------
//Modèle USER:

//INSCRIPTION
app.post('/api/signup', function(req, res){
    const Data = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        admin: false,
    })
    Data.save().then(()=>{
        console.log("Utilisateur ajouté");
        res.redirect('/');

    }).catch(err => {console.log(err)});
})

//Affichage formulaire inscription
app.get('/newUser', function(req, res){
    res.render('Signup');
})
//Afichage formulaire de connexion
app.get('/login', function(req, res){
    res.render('Login');

})


var server = app.listen(5000, function(){
    console.log('server listening on port 5000');
})

