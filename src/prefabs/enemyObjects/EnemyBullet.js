class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnX, spawnY, state, targetX, targetY) {
        if(state == 0) {
            super(scene, spawnX, spawnY, 'redSlimeball').setOrigin(0.5, 0.5);
        } else {
            super(scene, spawnX, spawnY, 'blueSlimeball').setOrigin(0.5, 0.5);
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

        this.setDepth(2000);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(12);

        this.setRotation(Phaser.Math.Angle.Between(this.spawnX, this.spawnY, this.targetX, this.targetY));
        this.scene.physics.moveTo(this, this.targetX, this.targetY, shooterConfig.bulletSpeed);

        this.corruptionBleed = corruptionParticles.createEmitter({
            follow: this,
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            lifespan: { min: 1000, max: 1500 },
            speedX: { min: -enemyExplodeVel/2, max: enemyExplodeVel/2 },
            speedY: { min: -enemyExplodeVel/2, max: enemyExplodeVel/2 },
        });
        this.corruptionBleed.stop();
    }

    update(){
        // Remove if goes off screen
        if(this.x < 0 || this.x > this.scene.map.widthInPixels || this.y < 0 || this.y > this.scene.map.heightInPixels) {
            this.group.remove(this, true, true);
        }
    }
}