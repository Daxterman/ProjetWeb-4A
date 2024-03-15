import "./Player"


class Game {

    constructor(ID)
    {
        this.id = ID;
        this.Players = []
    }

    add_player(name,session)
    {
        this.Players.push(new Player(this.id,session,name))
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




}