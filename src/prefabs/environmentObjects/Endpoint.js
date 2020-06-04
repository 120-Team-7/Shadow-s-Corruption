class Endpoint extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, sceneDestination, faceDirection) {
        super(scene, oSpawnX, oSpawnY, 'endDoor').setOrigin(0.5, 0.5);

        if(faceDirection == "y") {
            this.setAngle(90);
        }

        this.scene = scene;
        this.sceneDestination = sceneDestination;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(16);

        this.collider = scene.physics.add.overlap(this, player, function() {
            if(!player.isSceneTransfer) {
                player.sceneTransfer(sceneDestination);
            }
        }, null, scene)
    }
}