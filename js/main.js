/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var config = {
    type: Phaser.AUTO,
    width: 700,
    height: 650,
    backgroundColor: 0x808080,
    parent:'game',
    title:'Connect 4'
};

var game = new Phaser.Game(config);
game.scene.add('Game',Game);
game.scene.start('Game');