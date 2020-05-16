class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnX, spawnY, state, targetX, targetY) {
        if(state == 0) {
            super(scene, spawnX, spawnY, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.15, 0.15);
        } else {
            super(scene, spawnX, spawnY, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.15, 0.15);
        }
        
        let bullet = this;
        this.group = group;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.scene = scene;
        this.state = state;
        this.targetX = targetX;
        this.targetY = targetY;
        
        this.damage = shooterConfig.damage;
        this.shooting = false;
        this.first = false;
        this.second = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(5);

        this.setRotation(Phaser.Math.Angle.Between(this.spawnX, this.spawnY, this.targetX, this.targetY));
        this.scene.physics.moveTo(this, this.targetX, this.targetY, shooterConfig.bulletSpeed);
    }

    update(){
        // Remove if goes off screen
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            this.group.remove(this, true, true);
        }
    }
}