const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/genres', function (req, res) {
  const uniqueGenres = new Set();
  const movies = Object.values(movieModel);
  movies.forEach(movie => {
      if (movie.Genres) {
          movie.Genres.forEach(genre => {
              uniqueGenres.add(genre);
          });
      }
  });
  const sortedGenres = Array.from(uniqueGenres).sort();

  res.send(sortedGenres);
});

app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);

  if (req.query.genre) {
      const requestedGenre = req.query.genre;
      
      movies = movies.filter(movie => {
          return movie.Genres && movie.Genres.includes(requestedGenre);
      });
  }

  res.send(movies);
});

app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
