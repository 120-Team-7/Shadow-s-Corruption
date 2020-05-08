class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, health) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5);
        }


        this.scene = scene;
        this.state = state;
        this.health = health;
        let obs = this;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}