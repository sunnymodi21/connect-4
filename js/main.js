var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: 0x808080,
    parent:'game',
    title:'Connect 4'
};

var game = new Phaser.Game(config);
game.scene.add('Game',Game);
game.scene.start('Game');