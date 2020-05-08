class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
        super(scene, oSpawnX, oSpawnY, '').setOrigin(0.5, 0.5);
        
        let bullet = this;
        this.group = group;
        this.scene = scene;
        this.state = state;
        this.active = true;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.velocity.x = 100;
        scene.physics.moveTo(this, targetX, targetY, bulletSpeed);
        console.log(this);
        console.log(this + " " + targetX + " " + targetY + " " + bulletSpeed);

    }
}