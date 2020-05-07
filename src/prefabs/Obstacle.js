class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state) {
        super(scene, oSpawnX, oSpawnY, '').setOrigin(0.5, 0.5);

        this.scene = scene;
        this.state = state;
        let obs = this;
        console.log(this.state);


        // Figure out how to make thsi work later
        collider = scene.physics.add.collider(this, scene.player, null, obs.checkState(obs.state), scene)
            
        // collider = scene.physics.add.collider(this, scene.player);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setDrag(obstacleDrag);
        this.setCollideWorldBounds(true);

        console.log(this);
        console.log(collider);
    }


    update() {
        collider.update();
    }

    checkState(state) {
        if(state == playerState){
            console.log("true" + state + playerState);
            return true;
        } else {
            console.log("false" + state + playerState);
            return false;
        }
    }

    collide() {
        console.log("collide");
    }
}