class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        if(state == 0){
            // super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5);
            super(scene, oSpawnX, oSpawnY, 'invisibleRed').setOrigin(0.5, 0.5);
        } else {
            // super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5);
            super(scene, oSpawnX, oSpawnY, 'invisibleBlue').setOrigin(0.5, 0.5);
        }

        this.scene = scene;
        this.group = group;
        this.state = state;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}