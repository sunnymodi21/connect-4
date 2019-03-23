/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};
var isConnected = false;
Game.preload = function() {
    this.load.image('win', 'assets/you-win.png');
};
// var num_keys = 'ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE,NUMPAD_ZERO,NUMPAD_ONE,NUMPAD_TWO,NUMPAD_THREE,NUMPAD_FOUR,NUMPAD_FIVE,NUMPAD_SIX,NUMPAD_SEVEN,NUMPAD_EIGHT,NUMPAD_NINE';
// var num_keys_arr = num_keys.split(',')
// var keys;
var scene;
Game.create = function(){
    scene = this
    if(isConnected){
        Game.newGame();
    } else{
        new_game_text = scene.add.text(-110,-20, '', { font: '48px Arial bold', fill: '#000000' })
        new_game_text.setText('New Game');
        new_game_container = scene.add.container(300, 500, [ new_game_text ]);
        new_game_container.setSize(new_game_text.width, new_game_text.height);
        new_game_container.setInteractive()
        .on('pointerdown', function(pointer, localX, localY, event){
            Client.askNewId();
            event.stopPropagation();
            new_game_container.destroy();
        })
    }
};

Game.newGame = function(){
    var connect_matrix = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];
    scene.add.displayList.removeAll()
    var graphics = scene.add.graphics({ fillStyle: { color: 0xDCDCDC } });
    var text = scene.add.text(250, 600, '', { font: '48px Arial bold', fill: '#0f0f00' });
    text.on('setdata', function () {
        text.setText([
            text.getData('name')
        ]);
    });
    text.setData('name', 'Your turn');
    current_turn = 1;
    var circles = [];

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
            graphics.fillCircleShape(circles[x][y]);
        }
    }
    graphics.setData('winner', 0)
    scene.input.on('pointerdown', function (pointer) {
        if(graphics.getData('winner')==0){
            var x = Math.floor(pointer.x / 100);
            var y = Math.floor(pointer.y / 100);
            var winner = Game.movePlayer(x, connect_matrix, scene)
            if( winner !=undefined){
                graphics.setData('winner', winner)
                var win = scene.add.image(300, 300, 'win')
                win.setScale(0.5)
                new_game_rect = scene.add.rectangle(0,0, 300, 80, 0xf47742);
                new_game_text = scene.add.text(-110,-20, '', { font: '48px Arial bold', fill: '#0f0f00' })
                new_game_text.setText('New Game');
                new_game_container = scene.add.container(300, 500, [ new_game_rect, new_game_text ]);
                new_game_container.setSize(new_game_rect.width, new_game_rect.height)
                new_game_container.setInteractive()
                .on('pointerdown', function(){
                    scene.scene.restart()
                });
            }
        }
    });
}
Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};

Game.movePlayer = function(x, connect_matrix, scene){
    for(var y=connect_matrix.length-1; y=>0; y--){
        if(connect_matrix[y] != undefined){
            if(connect_matrix[y][x]==0){
                if(current_turn==1){                                
                    connect_matrix[y][x]=1
                    scene.add.circle(50 + x * 100, 50 + y * 100, 45, 0xFF0000);
                    current_turn=2
                    break
                } else {
                    connect_matrix[y][x]=current_turn
                    scene.add.circle(50 + x * 100, 50 + y * 100, 45, 0xFFFF33);
                    current_turn=1
                    break
                }
            }
        } else 
        {
            return false
        }
    }
    var winner = Game.find4(connect_matrix)
    return winner
};

Game.find4 = function(connect_matrix){
    for(var y=0; y<connect_matrix.length; y++){
        for(var x=0; x<connect_matrix[y].length; x++){
            var j = x
            var i = y
            if(connect_matrix[i][j]!=0){
                var player = connect_matrix[i][j];

            if(
                j+3 < connect_matrix[y].length &&
                connect_matrix[i][j+1] == player &&
                connect_matrix[i][j+2] == player &&
                connect_matrix[i][j+3] == player)
                return player;
            
            if(i+3 < connect_matrix.length){
                if(
                    connect_matrix[i+1][j] == player &&
                    connect_matrix[i+2][j] == player &&
                    connect_matrix[i+3][j] == player)
                    return player;

                if(
                    connect_matrix[i+1][j+1] == player &&
                    connect_matrix[i+2][j+2] == player &&
                    connect_matrix[i+3][j+3] == player)
                    return player;
                if(
                    connect_matrix[i+1][j-1] == player &&
                    connect_matrix[i+2][j-2] == player &&
                    connect_matrix[i+3][j-3] == player)
                    return player;
                }
            }               
        }
    }
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};