const express = require('express')
const mongoose = require('mongoose')
const Song =  require('./models/song.js')
var favicon = require('serve-favicon');
const app = express()

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/songRecorder', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
app.use(favicon((__dirname+ '/public/Assets/favicon.ico'))); 

app.get('/', (req, res) =>{
    res.render('index')
})

app.post('/songs', async (req, res)=>{
    console.log(req.body)
    const song = new Song({
        notes: req.body.songNotes,
        title: req.body.title
    })

    await song.save()

    res.json(song)
    //req.body.songNotes
})

app.get('/songs/:id', async (req,res)=>{
    let song 
    try{
        song = await Song.findById(req.params.id)
    } catch(e){
        song = undefined
    }
    res.render('index', {song:song})
})

/*app.get('/list', async (req,res)=>{
    let list
    try{
        list = await Song.find({})
    } catch(e){
        list = undefined
    }
    console.log(list)
    res.render('index', {list:list})
    /*Song.find({}, (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            // send study history
            res.render('index', {list: data});
        }
    });//
});*/

app.get('/about', async (req,res)=>{
    res.render('about')
});

app.get('/song_table/:page', function(req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Song
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, songs) {
            Song.count().exec(function(err, count) {
                console.log(count)
                if (err) return next(err)
                res.render('table', {
                    songs: songs,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})
const port = process.env.PORT || 5000;
app.listen(port)
console.log("Listening to port 5000")

