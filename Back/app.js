require('dotenv').config();

var express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Game = require('./Classes/Game');
var app = express();

var client_id = process.env.ClientID;
var client_secret = process.env.SecretID;
var token = '';
var sessionIdPlayerBuzz;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
  origin: '*'
}));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const authOptions = {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials',
};
  


async function playlist(token,id)
{
    const  response = await fetch('https://api.spotify.com/v1/playlists/'+id+"/tracks", {
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  const data = await response.json();
  var tab = [];
  if (data.items === undefined){return null;}
  data.items.forEach(element => {
    let artists = [];
    element.track.artists.forEach(ele => {artists.push(ele.name);});
  
    tab.push(
      {
        "name": element.track.name,
        "img" : element.track.album.images[0].url,
        "id": element.track.id,
        "artist" : artists,
        "year" : element.track.album.release_date
      }
    );
  });
  const shuffle = tab.sort((a, b) => 0.5 - Math.random());
  
  return shuffle;
}


fetch("https://accounts.spotify.com/api/token",authOptions).then(resp => resp.json()).then(json => token = json.access_token);




app.get("/:id",function(req,res){
  console.log("Url: "+ req.originalUrl);
  const id = req.params.id;
  if (!id){id ="37i9dQZF1DWWl7MndYYxge";};
  playlist(token,id).then(shuffle => res.json(shuffle));
})

//Créer Game
const myGame = new Game(1);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('buzz', (data) => {
    // Récupérer l'ID de session de l'utilisateur
    sessionIdPlayerBuzz = data.sessionId;

    console.log('Received buzz event from session:', sessionIdPlayerBuzz);

    const roundPoints = myGame.getRoundPoints();
    const pointsToAttributeToPlayer = 2-roundPoints;

    io.to('lecteur').emit('PauseBuzzer', {pointsToAttributeToPlayer : pointsToAttributeToPlayer});
    io.to('clients').emit('PauseBuzzer');
  });

  socket.on('PauseFromLecteur', () => {
    // Récupérer l'ID de session de l'utilisateur

    console.log('Received pause instruction from lecteur');

    // Émission d'un événement "PauseFromLecteur" vers la room 'clients'
    io.to('clients').emit('PauseFromLecteur');
  });

  socket.on('NextFromLecteur', () => {

    console.log('Received next instruction from lecteur');
    myGame.resetRoundPoints();
    // Émission d'un événement "PauseFromLecteur" vers la room 'clients'
    io.to('clients').emit('NextFromLecteur');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

   // Gestion de la demande de rejoindre une room
   socket.on('joinRoom', (room) => {
    console.log(`Client joined room ${room}`);
    socket.join(room); // Rejoindre la room spécifiée
  });

  //Un joueur envoie ses infos
  socket.on('infos_joueur', (data) => {
    myGame.add_player(data.name,data.sessionId);
    console.log(myGame);
  })

  //Demande d'ajout de points
  socket.on('ajouterPoints', (data) => {
    myGame.addPointsToPlayer(sessionIdPlayerBuzz,data.nbpoints);
    myGame.addRoundPoints(data.nbpoints);
    console.log(myGame);

    if(myGame.getRoundPoints() == 2)
    {
      io.to('lecteur').emit('Skip');
    }
  })

});

app.listen(8080);
console.log("App listening on port 8080...");

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});