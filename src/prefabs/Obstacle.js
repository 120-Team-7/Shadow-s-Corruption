class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5);
        }

        this.scene = scene;
        this.state = state;
        let obs = this;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // checkState(state) {
    //     if(state == playerState){
    //         console.log("true" + state + playerState);
    //         return true;
    //     } else {
    //         console.log("false" + state + playerState);
    //         return false;
    //     }
    // }
}