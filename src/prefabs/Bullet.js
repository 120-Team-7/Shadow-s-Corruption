class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, targetX, targetY, state) {
        super(scene, oSpawnX, oSpawnY, '').setOrigin(0.5, 0.5);

        this.scene = scene;
        this.state = state;
        let bullet = this;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);

        scene.physics.moveTo(this, targetX, targetY, bulletSpeed);
    }

    update() {
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            console.log('gone');
            this.destroy(); 
        }
    }
}