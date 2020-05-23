class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnX, spawnY, state, targetX, targetY) {
        if(state == 0) {
            super(scene, spawnX, spawnY, 'redSlimeball').setOrigin(0.5, 0.5);
        } else {
            super(scene, spawnX, spawnY, 'blueSlimeball').setOrigin(0.5, 0.5);
            this.setAlpha(0.6);
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

        this.body.setCircle(12);

        this.setRotation(Phaser.Math.Angle.Between(this.spawnX, this.spawnY, this.targetX, this.targetY));
        this.scene.physics.moveTo(this, this.targetX, this.targetY, shooterConfig.bulletSpeed);

        // this.slimeBleed = slimeParticles.createEmitter({
        //     emitZone: { source: this.emitCircle },
        //     alpha: { start: 1, end: 0 },
        //     scale: { start: 0.5, end: 0 },
        //     lifespan: { min: 1000, max: 1500 },
        //     speedX: { min: -enemyExplodeVel, max: enemyExplodeVel },
        //     speedY: { min: -enemyExplodeVel, max: enemyExplodeVel },
        // });
        // this.corruptionBleed.stop();
    }

    update(){
        // Remove if goes off screen
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            this.group.remove(this, true, true);
        }
    }
}