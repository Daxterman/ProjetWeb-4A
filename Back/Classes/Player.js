class Player {

    constructor(ID_game,ID_session,name)
    {
        this.id = ID_game;
        this.session = ID_session
        this.name = name
        this.nb_points = 0
    }

    getPlayerPoints()
    {
        return this.nb_points;
    }
}

module.exports = Player;