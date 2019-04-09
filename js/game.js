/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {}
var isConnected = false
Game.preload = function() {
    this.load.image('win', 'assets/you-win.png')
}
// var num_keys = 'ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE,NUMPAD_ZERO,NUMPAD_ONE,NUMPAD_TWO,NUMPAD_THREE,NUMPAD_FOUR,NUMPAD_FIVE,NUMPAD_SIX,NUMPAD_SEVEN,NUMPAD_EIGHT,NUMPAD_NINE'
// var num_keys_arr = num_keys.split(',')
// var keys
var scene
Game.connect_matrix
Game.current_turn
Game.create = function(){
    Client.askNewId()
    scene = this
    if(isConnected){
        Game.newGame(false)
    } else {
        new_game_text = scene.add.text(-110,-20, '', { font: '48px Arial bold', fill: '#000000' })
        new_game_text.setText('New Game')
        new_game_container = scene.add.container(300, 500, [ new_game_text ])
        new_game_container.setSize(new_game_text.width, new_game_text.height)
        new_game_container.setInteractive()
        .on('pointerdown', function(pointer, localX, localY, event){
            Game.newGame(false)
            event.stopPropagation()
            new_game_container.destroy()
        })
    }
}

Game.newGame = function(join){
    Game.connect_matrix = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ]
    scene.add.displayList.removeAll()
    var graphics = scene.add.graphics({ fillStyle: { color: 0xDCDCDC } })
    var text = scene.add.text(250, 600, '', { font: '48px Arial bold', fill: '#0f0f00' })
    text.on('setdata', function () {
        text.setText([
            text.getData('name')
        ])
    })
    text.setData('name', 'Your turn')
    if(join == true){
        Game.current_turn = Client.otherPlayer.id
    } else {
        Game.current_turn = Client.my.id
    }
    var circles = []

    for(var x = 0; x < 7; x++)
    {
        circles[x] = [];
        for(var y = 0; y < 6; y++)
        {
            circles[x][y] = new Phaser.Geom.Circle(50 + x * 100, 50 + y * 100, 45);
        }
    }
    for(var x = 0; x < 7; x++)
    {
        for(var y = 0; y < 6; y++)
        {
            graphics.fillCircleShape(circles[x][y])
        }
    }
    graphics.setData('winner', 0)
    scene.input.on('pointerdown', function (pointer) {
        if(graphics.getData('winner')==0 && Game.current_turn == Client.my.id){
            var x = Math.floor(pointer.x / 100)
            var y = Math.floor(pointer.y / 100)
            var winner = Game.movePlayer(x)
            Client.movePlayer(x)
            if( winner !=undefined){
                graphics.setData('winner', winner)
                var win = scene.add.image(300, 300, 'win')
                win.setScale(0.5)
                new_game_rect = scene.add.rectangle(0,0, 300, 80, 0xf47742)
                new_game_text = scene.add.text(-110,-20, '', { font: '48px Arial bold', fill: '#0f0f00' })
                new_game_text.setText('New Game')
                new_game_container = scene.add.container(300, 500, [ new_game_rect, new_game_text ])
                new_game_container.setSize(new_game_rect.width, new_game_rect.height)
                new_game_container.setInteractive()
                .on('pointerdown', function(){
                    scene.scene.restart()
                })
            }
        }
    })
}

Game.movePlayer = function(x){
    for(var y=Game.connect_matrix.length-1; y=>0; y--){
        if(Game.connect_matrix[y] != undefined){
            if(Game.connect_matrix[y][x]==0){
                if(Game.current_turn==Client.my.id){                                
                    Game.connect_matrix[y][x]=1
                    scene.add.circle(50 + x * 100, 50 + y * 100, 45, Client.my.color)
                    Game.current_turn=Client.otherPlayer.id
                    break
                } else {
                    Game.connect_matrix[y][x]=Game.current_turn
                    scene.add.circle(50 + x * 100, 50 + y * 100, 45, Client.otherPlayer.color)
                    Game.current_turn = Client.my.id
                    break
                }
            }
        } else 
        {
            return false
        }
    }
    var winner = Game.find4()
    return winner
}

Game.find4 = function(){
    for(var y=0; y<Game.connect_matrix.length; y++){
        for(var x=0; x<Game.connect_matrix[y].length; x++){
            var j = x
            var i = y
            if(Game.connect_matrix[i][j]!=0){
                var player = Game.connect_matrix[i][j]

            if(
                j+3 < Game.connect_matrix[y].length &&
                Game.connect_matrix[i][j+1] == player &&
                Game.connect_matrix[i][j+2] == player &&
                Game.connect_matrix[i][j+3] == player)
                return player
            
            if(i+3 < Game.connect_matrix.length){
                if(
                    Game.connect_matrix[i+1][j] == player &&
                    Game.connect_matrix[i+2][j] == player &&
                    Game.connect_matrix[i+3][j] == player)
                    return player

                if(
                    Game.connect_matrix[i+1][j+1] == player &&
                    Game.connect_matrix[i+2][j+2] == player &&
                    Game.connect_matrix[i+3][j+3] == player)
                    return player
                if(
                    Game.connect_matrix[i+1][j-1] == player &&
                    Game.connect_matrix[i+2][j-2] == player &&
                    Game.connect_matrix[i+3][j-3] == player)
                    return player
                }
            }               
        }
    }
}