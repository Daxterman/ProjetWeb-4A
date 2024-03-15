var tab;
var i = 0;
var pause = true;
var t_restant = 29;
var f = null;


document.addEventListener('DOMContentLoaded',async function() {
  // Votre fonction à exécuter au chargement de la page
  res =  await fetch("http://localhost:8080");
  tab =  await res.json();



  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
    const options = {
      width: '1%',
      height: '1',
      uri: "spotify:track:"+tab[0].id
    };
    const callback = (EmbedController) => {
      document.querySelectorAll('.episode').forEach(
        episode => {
          episode.addEventListener('click', () => {
            episode.setAttribute("data-spotify-id","spotify:track:"+tab[i].id);
            i = (i+1)%tab.length;
            EmbedController.loadUri(episode.dataset.spotifyId);  
            t_restant = 29; 
            $('#progress').attr("style","width: " +0).attr('aria-valuenow', 0);
            EmbedController.togglePlay();
            $("#next").prop('disabled',true);
            $("#pause").prop('disabled',false);
            $(".answer").html("");
  
            pause=false;
            f=setInterval(interval,1000);
          });
        });
        document.querySelectorAll('.pause').forEach(
        episode => {
          episode.addEventListener('click', () => {
            EmbedController.togglePlay();
            pause = !pause;
            if(pause == true)
            {
              $("#progress").removeClass("progress-bar-animated");
            }
            else
            {
              $("#progress").addClass("progress-bar-animated");
            }
          });
        })
      };
    IFrameAPI.createController(element, options, callback);

  };

  const socket = io('http://localhost:3000');

  // Rejoindre la room 'lecteurs' dès que la connexion est établie
  socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('joinRoom', 'lecteur'); // Demande de rejoindre la room 'lecteur'
  });

  // Écoute de l'événement 'PauseBuzzer' du serveur
  socket.on('PauseBuzzer', () => {
  console.log('Received triggerClick from the server');
    
  // Déclenche le clic sur le bouton "pause"
  const pauseButton = document.getElementById('pause');
  if (pauseButton) {

    pauseButton.click();
  } else {
    console.error('Pause button not found');
  }
  });

});

function interval()
{
  if(!pause)
  {
    t_restant --;
    percent = (30-t_restant)/30*100 + "%";
    $('#progress').attr("style","width: " +percent).attr('aria-valuenow', percent).html("<b>"+t_restant+"</b>");
    if(t_restant == 0)
    {
      clearInterval(f);
      $('#progess').html("");
      document.getElementById("pause").click();
      $("#pause").prop('disabled',true);
      $("#next").prop('disabled',false);
      reveal();
    }
  }
}


function reveal()
{
  let img = '<img src="'+tab[i-1].img+'" alt="album">'
  let nom = "<h5><b>"+tab[i-1].name+"</b></h5>"
  let html = img + nom + "<p>";
  tab[i-1].artist.forEach(element =>{
    html = html + element + "</br>";

  });
  html = html + "</p>";
  $(".answer").html(html);
}