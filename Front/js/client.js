document.addEventListener('DOMContentLoaded',async function() {
    // Générer un UUID (identifiant de session)
    const sessionId = crypto.randomUUID();
    //console.log('Session ID:', sessionId);

    // Stocker l'UUID dans localStorage
    sessionStorage.setItem('sessionId', sessionId);
    
    const socket = io('http://localhost:3000');

    // Fonction appelée lorsqu'un bouton est pressé à distance
    $("#buzz").on("click", click => {
      socket.emit('buzz' ,{ sessionId: sessionId});

    })
});