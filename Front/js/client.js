var disabled = true;

document.addEventListener('DOMContentLoaded',async function() {
    // Générer un UUID (identifiant de session)
    let sessionId = getCookie('sessionId');

    // Si aucun ID de session n'est trouvé dans les cookies, générer un nouvel ID et le stocker
    if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie('sessionId', sessionId, 1); // Stocker pendant 1 jour
}
      
if(sessionStorage.getItem("name") === null)
{
  window.location.href = '/';
}
const name = sessionStorage.getItem("name")

    const buzzButton = document.getElementById("buzz");
    desactiverBouton(buzzButton);
    
    const socket = io(':3000/');

    socket.on('connect', () => {
      console.log('Client connecté au server');
      socket.emit('joinRoom', 'clients'); // Demande de rejoindre la room 'clients'
      //Le client envoie ses infos
      socket.emit('infos_joueur', { sessionId: sessionId, name: name });
      });
    
    // Écoute de l'événement 'PauseBuzzer' du serveur
    socket.on('PauseBuzzer', () => {
      console.log('Received PauseBuzzer from the server');

      const buzzButton = document.getElementById("buzz");
      if (buzzButton) {
        desactiverBouton(buzzButton);
      } else {
        console.error('Buzz button not found');
      }
    });

    socket.on('PauseFromLecteur', () => {
      console.log('Received PauseFromLecteur from the server');

      const buzzButton = document.getElementById("buzz");
      if (buzzButton) {
        if(disabled)
        {
          activerBouton(buzzButton);
        }
        else{
          desactiverBouton(buzzButton);
        }
        
      } else {
        console.error('Buzz button not found');
      }
    });

    socket.on('NextFromLecteur', () => {
      console.log('Received NextFromLecteur from the server');

      const buzzButton = document.getElementById("buzz");
      activerBouton(buzzButton);
      
    });

    // Fonction appelée lorsqu'un bouton est pressé à distance
    $("#buzz").on("click", click => {
      socket.emit('buzz' ,{ sessionId: sessionId});

    })


    socket.on("score",data =>
{
  $('#score tbody').empty();
  $.each(data, function(index, objet) {
    const row = $('<tr>');

    // Insérer le nom dans la première cellule
    $('<td>').text(objet.name).appendTo(row);

    // Insérer les points dans la deuxième cellule
    $('<td>').text(objet.points.toString()).appendTo(row);

    // Ajouter la ligne à tbody
    row.appendTo('#score tbody');
});})
});



function desactiverBouton(buzzButton) {
  disabled = true;
  buzzButton.disabled = true;
  buzzButton.style.opacity = "0.5";
  buzzButton.style.pointerEvents = "none";
}

// Fonction pour réactiver les animations du bouton
function activerBouton(buzzButton) {
  disabled = false;
  buzzButton.disabled = false;
  buzzButton.style.opacity = "1.0";
  buzzButton.style.pointerEvents = "auto";
}

// Fonction pour créer un cookie avec un nom, une valeur et une durée de validité en jours
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
  console.log(name + "=" + (value || "") + expires + "; path=/")
  console.log(document.cookie)
}

// Fonction pour récupérer la valeur d'un cookie à partir de son nom
function getCookie(name) {
  let nameEQ = name + "=";
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
      }
  }
  return null;
}