/**
 * Created by Jerome on 03-03-17.
 */

var Client = {}
Client.socket = io.connect()
Client.otherPlayer = {}
Client.my = {}

Client.sendTest = function(){
    console.log("test sent")
    Client.socket.emit('test')
}

Client.askNewId = function(){
    Client.socket.emit('get-id')
}

Client.join = function(e){
    e.preventDefault()
    var id = document.getElementById('join-id')
    Client.socket.emit('join',{id:id.value})
    Client.otherPlayer.id = id.value
    Client.otherPlayer.color = 0xFF0000
    Client.my.color = 0xFFFF33 
    Game.newGame(true)    
}

Client.movePlayer = function(x){
    Client.socket.emit('move',{x:x,id: Client.otherPlayer.id})
}

Client.socket.on('get-id',function(data){
    console.log(data)
    Client.my.id = data
})

Client.socket.on('move',function(data){
    Game.movePlayer(data.x)
})

Client.socket.on('join',function(id){
    console.log(id)
    Client.otherPlayer.id = id
    Client.otherPlayer.color = 0xFFFF33
    Client.my.color = 0xFF0000
})

Client.socket.on('disconnect',function(id){
    Game.removePlayer(id)
})


