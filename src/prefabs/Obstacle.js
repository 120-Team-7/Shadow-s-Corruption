class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state, health) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5);
        }

        let obs = this;
        this.scene = scene;
        this.group = group;
        this.state = state;
        this.health = health;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    takeDamage(damage){
        this.health -= damage;
        if(this.health <= 0){
            // this.group.remove(this, true, true);
            this.body.destroy();
            this.setAlpha(0);
        }
    }
}