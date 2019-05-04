var Client = {}
Client.socket = io.connect()
Client.otherPlayer = {}
Client.my = {}
Client.isConnected = false

Client.copyId = function(){
    navigator.clipboard.writeText($('#user-id').text())
    $('#copy-text').show()
    setTimeout(function(){ $('#copy-text').hide() }, 2000)
}

Client.askNewId = function(){
    Client.socket.emit('get-id')
}

Client.join = function(e){
    e.preventDefault()
    var id = $('#join-id').val()
    if(id!='' && id!=Client.my.id && !Client.isConnected){
        Client.socket.emit('join',{id:id}, function(success){
            if(success){
                Client.otherPlayer.id = id
                Client.otherPlayer.color = 0xFF0000
                Client.my.color = 0xFFFF33
                Client.isConnected = true 
                Game.newGame(true)
            }
        })
    }
}

Client.movePlayer = function(x){
    Client.socket.emit('move',{x:x,id: Client.otherPlayer.id})
}

Client.socket.on('get-id',function(data){
    console.log(data)
    $('#user-id').text(data)
    Client.my.id = data
})

Client.socket.on('move',function(data){
    Game.movePlayer(data.x)
})

Client.socket.on('join',function(id){
    if(!Client.isConnected){
        Client.isConnected = true
        console.log(id)
        Client.otherPlayer.id = id
        Client.otherPlayer.color = 0xFFFF33
        Client.my.color = 0xFF0000
        Game.newGame(false)
    }
})

Client.socket.on('disconnect-player',function(){
    Client.isConnected = false
    Client.otherPlayer.id = ''
})