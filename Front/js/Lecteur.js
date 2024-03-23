var tab;
var i = 0;
var pause = true;
var t_restant = 29;
var f = null;
var buzzClick = false;


document.addEventListener('DOMContentLoaded',async function() {
  // Votre fonction à exécuter au chargement de la page
  id = sessionStorage.getItem("Playlist");
  if(!id){id = id = "37i9dQZF1DWWl7MndYYxge";};
  
  //res =  await fetch("https://85a81c60-e91e-40f4-8fc7-cbfdd752a5dd-00-3dztisbt7dygb.picard.replit.dev/"+id);
  res =  await fetch("http://localhost:3000/"+id);
  tab =  await res.json();

  const socket = io('http://localhost:3000');

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
            socket.emit('NextFromLecteur');
            episode.setAttribute("data-spotify-id","spotify:track:"+tab[i].id);
            i = (i+1)%tab.length;
            EmbedController.loadUri(episode.dataset.spotifyId);  
            t_restant = 29; 
            $('#progress').attr("style","width: " +0).attr('aria-valuenow', 0);
            $("#progress").addClass("progress-bar-animated");
            EmbedController.togglePlay();
            $("#next").prop('disabled',true);
            $("#pause").prop('disabled',false);
            $("#ajout1Point").prop('disabled',true);
            $("#ajout2Points").prop('disabled',true);
            $(".answer").html("");
            pause=false;
            f=setInterval(interval,1000);
          });
        });
        document.querySelectorAll('.pause').forEach(
        episode => {
          episode.addEventListener('click', () => {
            if(!buzzClick)
            {
              socket.emit('PauseFromLecteur');
            }
            else
            {
              buzzClick = false;
            }
            
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

        document.getElementById('ajout1Point').addEventListener('click', () => {
          ajouterPoints(socket, 1);
      });

      document.getElementById('ajout2Points').addEventListener('click', () => {
        ajouterPoints(socket, 2);
    });

      };
    IFrameAPI.createController(element, options, callback);

  };

  socket.on('connect', () => {
  console.log('Lecteur connecté au server');
  socket.emit('joinRoom', 'lecteur'); // Demande de rejoindre la room 'lecteur'
  });

  // Écoute de l'événement 'PauseBuzzer' du serveur
  socket.on('PauseBuzzer', (data) => {
  console.log('Received PauseBuzzer from the server');
    
  // Déclenche le clic sur le bouton "pause"
  const pauseButton = document.getElementById('pause');
  if (pauseButton) {
    buzzClick = true;
    pauseButton.click();
  } else {
    console.error('Pause button not found');
  }

  $("#ajout1Point").prop('disabled',false);

  if(data.pointsToAttributeToPlayer == 2)
  {
    $("#ajout2Points").prop('disabled',false);
  }
  
  

  });

  socket.on('Skip', () => {
   
    $("#skip").click();
    });



$("#reveal").on("click",click => {
  reveal();
});

$("#refresh").on("click",click => {
  refresh();
})

$("#clear").on("click",click => {
  sessionStorage.removeItem("Playlist");
  location.reload(true);
})

;


$("#skip").on("click",click => {
  t_restant = 0;
  percent = (30-t_restant)/30*100 + "%";
  $('#progress').attr("style","width: " +percent).attr('aria-valuenow', percent).html("<b>"+t_restant+"</b>");
  clearInterval(f);
  $('#progess').html("");
  document.getElementById("pause").click();
  $("#pause").prop('disabled',true);
  $("#next").prop('disabled',false);
  reveal();
})
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
  let img = '<img src="'+tab[i-1].img+'" alt="album">';
  let nom = "<h5><b>"+tab[i-1].name+"</b></h5>";
  let annee = "<h6>"+tab[i-1].year +"</h6>";
  let html = img + nom +annee+ "<p>";
  tab[i-1].artist.forEach(element =>{
    html = html + element + "</br>";
  });
  html = html + "</p>";
  $(".answer").html(html);
}

function refresh()
{
  sessionStorage.setItem('Playlist', $("#form").val());
  location.reload(true);
}

function ajouterPoints(socket, nbpoints)
{
  socket.emit('ajouterPoints', {nbpoints : nbpoints});
  
  $("#ajout1Point").prop('disabled',true);
  $("#ajout2Points").prop('disabled',true);
  
}