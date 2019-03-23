/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewId = function(){
    Client.socket.emit('get-id');
};

Client.join = function(e){
    e.preventDefault();
    var id = document.getElementById('join-id');
    Client.socket.emit('join',{id:id.value});
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('get-id',function(data){
    console.log(data);
    Game.newGame();
    //Game.addNewPlayer(id);
});

Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

Client.socket.on('disconnect',function(id){
    Game.removePlayer(id);
});


