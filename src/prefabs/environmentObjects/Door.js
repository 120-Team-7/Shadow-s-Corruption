class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, room1, room2) {
        if(state == 0){
            // super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5);
            super(scene, oSpawnX, oSpawnY, 'invisibleRed').setOrigin(0.5, 0.5);
        } else {
            // super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5);
            super(scene, oSpawnX, oSpawnY, 'invisibleBlue').setOrigin(0.5, 0.5);
        }

        this.scene = scene;
        this.room1 = room1;
        this.room2 = room2;

        this.exists = true;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);

    }
}