var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)
var MongoDB = require('./js/database')

var mongoclient = new MongoDB()

app.use('/css',express.static(__dirname + '/css'))
app.use('/js',express.static(__dirname + '/js'))
app.use('/assets',express.static(__dirname + '/assets'))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html')
})

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port)
    mongoclient.connect("connect-4")
})

var connectionDict = {}
io.on('connection',function(socket){
    socket.on('get-id',function(){
        socket.emit('get-id',socket.id)
        connectionDict[socket.id] = ''
    })

    socket.on('join',function(data, fn){    
        socket.to(data.id).emit('join',socket.id)
        if(connectionDict[data.id] == ''){
            fn(true)
            connectionDict[data.id] = socket.id
            connectionDict[socket.id] = data.id
        } else {
            fn(false)
        }
    })
    
    socket.on('move', function(data){
        socket.to(data.id).emit('move',data)
    })

    socket.on('disconnect', function (){
        if(connectionDict[socket.id] != ''){
            socket.to(connectionDict[socket.id]).emit('disconnect-player')
            connectionDict[connectionDict[socket.id]] = ''
            delete connectionDict[socket.id]
        } else {
            delete connectionDict[socket.id]
        }
    })
    
    socket.on('endgame', function(data){
        mongoclient.insert(data.gameMatrix)
    })
})
