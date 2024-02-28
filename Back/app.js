require('dotenv').config();
const fs = require("fs");
var express = require('express');
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


app.listen(8080);
console.log("App listening on port 8080...");