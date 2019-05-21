
var Game = {}
Game.preload = function() {
    this.load.image('win', 'assets/you-win.png')
    this.load.image('lose', 'assets/lose.png')
    this.load.image('lose', 'assets/tie.png')
}
var scene
Game.connect_matrix = []
Game.current_turn = ''
Game.winner = ''
Game.host = ''
Game.create = function(){
    Client.askNewId()
    scene = this
    Game.turn = scene.add.text(10, 550, 'Waiting for other player', { font: '48px Arial bold', fill: '#0f0f00' })
    Client.isConnected = false
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
    Game.winner = ''
    var graphics = scene.add.graphics({ fillStyle: { color: 0xDCDCDC } })
    if(join == true){
        Game.turn.setText(['Waiting for other player'])
        Game.current_turn = Client.otherPlayer.id
        Game.host = Client.otherPlayer.id
    } else {
        Game.turn.setText(['Your turn'])
        Game.host = Client.my.id
        Game.current_turn = Client.my.id
    }
    var circles = []

    for(var x = 0; x < 7; x++)
    {
        circles[x] = [];
        for(var y = 0; y < 6; y++)
        {
            circles[x][y] = new Phaser.Geom.Circle(45 + x * 90, 45 + y * 90, 40);
        }
    }
    for(var x = 0; x < 7; x++)
    {
        for(var y = 0; y < 6; y++)
        {
            graphics.fillCircleShape(circles[x][y])
        }
    }
    scene.input.on('pointerdown', function (pointer) {
        if(Game.winner == '' && Game.current_turn == Client.my.id){
            var x = Math.floor(pointer.x / 90)
            Game.movePlayer(x)
            Client.movePlayer(x)
        }
    })
}

Game.movePlayer = function(x){
    for(var y=Game.connect_matrix.length-1; y=>0; y--){
        if(Game.connect_matrix[y] != undefined){
            if(Game.connect_matrix[y][x]==0){
                if(Game.current_turn==Client.my.id){                                
                    Game.connect_matrix[y][x] = Game.current_turn
                    scene.add.circle(45 + x * 90, 45 + y * 90, 40, Client.my.color)
                    Game.current_turn=Client.otherPlayer.id
                    Game.turn.setText(['Waiting for other player'])
                    break
                } else {
                    Game.connect_matrix[y][x]=Game.current_turn
                    scene.add.circle(45 + x * 90, 45 + y * 90, 40, 0x00FFF)
                    scene.add.circle(45 + x * 90, 45 + y * 90, 36, Client.otherPlayer.color)
                    setTimeout(function(){ scene.add.circle(45 + x * 90, 45 + y * 90, 40, Client.otherPlayer.color)}, 6000)
                    Game.current_turn = Client.my.id
                    Game.turn.setText(['Your turn'])
                    break
                }
            }
        } else 
        {
            return false
        }
    }
    Game.winner = Game.find4()

    if( Game.winner != ''){
        var popupImage;
        if(Game.winner == Client.my.id){
            popupImage = scene.add.image(300, 300, 'win')
            Client.endGame(Game.connect_matrix)
        } else if(Game.winner == Client.otherPlayer.id){
            popupImage = scene.add.image(300, 300, 'lose')
        } else {
            popupImage = scene.add.image(300, 300, 'tie')
        }
        popupImage.setScale(0.5)
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

Game.find4 = function(){
    var filledCirclesCount = 0
    for(var y=0; y<Game.connect_matrix.length; y++){
        for(var x=0; x<Game.connect_matrix[y].length; x++){
            var j = x
            var i = y
            if(Game.connect_matrix[i][j]!=0){
                var player = Game.connect_matrix[i][j]
                filledCirclesCount++

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
    if(Game.connect_matrix.length*Game.connect_matrix[0].length == filledCirclesCount){
        return 'tie'
    }
    return ''
}