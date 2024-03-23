const Player = require('./Player');

class Game {

    constructor(ID)
    {
        this.id = ID;
        this.Players = []
        this.nb_points_round = 0;
    }

    add_player(name,session)
    {
        // Vérifier si un joueur avec le même ID de session existe déjà
        const existingPlayer = this.Players.find(player => player.session === session);

        // Si aucun joueur avec le même ID de session n'est trouvé, ajouter un nouveau joueur
        if (!existingPlayer) {
            this.Players.push(new Player(this.id, session, name));
        }
    }

    remove_player(session)
    {
        let idx = -1
        this.Players.forEach(element =>{
            if (element.session == session)
            {
                idx = this.Players.findIndex(element)
            }
        })
        if(idx != -1)
        {
            this.Players.splice(idx,idx)
        }
        
    }

    addPointsToPlayer(sessionID, nbpoints) {
        const player = this.Players.find(player => player.session === sessionID);
        if (player) {
            player.nb_points+=nbpoints;
            
        }
    }

    addRoundPoints(nb_points)
    {
        this.nb_points_round+=nb_points;
    }

    getRoundPoints()
    {
        return this.nb_points_round;
    }

    resetRoundPoints()
    {
        this.nb_points_round = 0;
    }

    getPointsFromPlayer(sessionID)
    {
        const player = this.Players.find(player => player.session === sessionID);
        if (player) {
            return player.getPlayerPoints();
            
        }
    }
}

module.exports = Game;