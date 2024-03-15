require('dotenv').config();
const fs = require("fs");
var express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var app = express();

var client_id = process.env.ClientID;
var client_secret = process.env.SecretID;
var token = '';

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
    const response = await fetch('https://api.spotify.com/v1/playlists/'+id+"/tracks", {
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  const data = await response.json();
  console.log(data);
  fs.writeFile('reponse.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('La réponse a été écrite dans le fichier reponse.json');
  });
}

fetch("https://accounts.spotify.com/api/token",authOptions).then(resp => resp.json()).then(json => console.log(json))


const temp = JSON.parse(fs.readFileSync("./reponse.json"));

var tab = [];

temp.items.forEach(element => {
  let artists = [];
  element.track.artists.forEach(ele => {artists.push(ele.name);});

  tab.push(
    {
      "name": element.track.name,
      "img" : element.track.album.images[0].url,
      "id": element.track.id,
      "artist" : artists
    }
  );
});



app.get("/",function(req,res){
  const shuffle = tab.sort((a, b) => 0.5 - Math.random());
  res.json(shuffle);
})

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('buzz', (data) => {
    // Récupérer l'ID de session de l'utilisateur
    const sessionId = data.sessionId;

    console.log('Received buzz event from session:', sessionId);

    // Émission d'un événement "PauseBuzzer" vers la room 'lecteur'
    io.to('lecteur').emit('PauseBuzzer');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

   // Gestion de la demande de rejoindre une room
   socket.on('joinRoom', (room) => {
    console.log(`Client joined room ${room}`);
    socket.join(room); // Rejoindre la room spécifiée
  });
});

app.listen(8080);
console.log("App listening on port 8080...");

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});