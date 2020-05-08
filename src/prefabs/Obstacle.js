class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state, health) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5);
        }


        this.scene = scene;
        this.group = group;
        this.state = state;
        this.health = health;
        let obs = this;
        this.exists = true;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    takeDamage(){
        this.health--;
        if(this.exists == true && this.health <= 0){
            this.exists = false;
            // this.group.remove(this, true, true);
            this.body.destroy();
            this.setAlpha(0);
        }
    }
}