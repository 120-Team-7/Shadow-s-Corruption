class Endpoint extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, sceneDestination) {
        super(scene, oSpawnX, oSpawnY, 'invisibleRed').setOrigin(0.5, 0.5);

        this.scene = scene;
        this.sceneDestination = sceneDestination;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.collider = scene.physics.add.overlap(this, player, function() {
            player.sceneTransfer(sceneDestination);
        }, null, scene)
    }
}