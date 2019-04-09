var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)

app.use('/css',express.static(__dirname + '/css'))
app.use('/js',express.static(__dirname + '/js'))
app.use('/assets',express.static(__dirname + '/assets'))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html')
})

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port)
})

io.on('connection',function(socket){
    socket.on('get-id',function(data){
        socket.emit('get-id',socket.id)
    })

    socket.on('join',function(data){          
        //Data = host id
        //Sends id of guest to host
        console.log(data)
        socket.to(data.id).emit('join',socket.id)
    })
    
    socket.on('move', function(data){
        socket.to(data.id).emit('move',data)
    })

    socket.on('win', function(data){
        socket.to(data.id).emit('win', data)
    })
    
    socket.on('test',function(){
        console.log('test received')
    })
})
