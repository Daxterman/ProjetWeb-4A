var disabled = true;

document.addEventListener('DOMContentLoaded',async function() {
    // Générer un UUID (identifiant de session)
    const sessionId = crypto.randomUUID();
    //console.log('Session ID:', sessionId);

    // Stocker l'UUID dans localStorage
    sessionStorage.setItem('sessionId', sessionId);

    const buzzButton = document.getElementById("buzz");
    desactiverBouton(buzzButton);
    
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Client connecté au server');
      socket.emit('joinRoom', 'clients'); // Demande de rejoindre la room 'clients'
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