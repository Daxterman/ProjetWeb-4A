document.addEventListener('DOMContentLoaded',async function() {

$("#Player").on("click",() => { Player()})
$("#Hote").on("click",() => { Hote()})




})

function Player()
{
    if($("#player_name").val().trim().length > 0)
    {
    sessionStorage.setItem("name",$("#player_name").val())
    window.location.href = './player';
    }
}

function Hote()
{
    if($("#id").val().trim().length > 0)
    {
    sessionStorage.setItem("Playlist",$("#id").val())
    window.location.href = './hote';
    }
}