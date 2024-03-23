class Player {

    constructor(ID_game,ID_session,name)
    {
        this.id = ID_game;
        this.session = ID_session
        this.name = name
        this.score = 0
    }

    reset()
    {
        this.score=0;
    }

    add()
    {
        this.score +=1;
    }


    sub()
    {
        this.score -=1;
    }


}