class Knife extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        if(usingCorruption){
            super(scene, oSpawnX, oSpawnY, 'corruptKnife').setOrigin(0.5, 0.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'knife').setOrigin(0.5, 0.5);
        }
        
        let knife = this;
        this.group = group;
        this.scene = scene;
        this.state = state;

        this.targetX;
        this.targetY;
        this.stuckEnemy;
        this.stuckOffsetX;
        this.stuckOffsetY;
        this.knifeSpeed = knifeSpeed;
        this.damage = knifeMeleeDamage;
        if(usingCorruption) {
            this.damage += corruption;
        }
        this.shooting = false;
        this.shot = false;
        this.corrupted = false;
        this.firstStuck = false;
        this.isStuck = false;
        this.exists = true;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setAngle(player.weaponAngle);

        this.body.setCircle(25);
        this.setDepth(999);

        this.fadeAway = this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: 'Quart.easeIn',
            duration: 1000,
        });
        this.fadeAway.stop();
    }

    update() {
        // On first shot, apply corruption if using corruption, shoot toward given target
        if(this.shot){
            this.shot = false;
            if(usingCorruption) {
                this.corrupted = true;
                this.particleTrail = corruptionParticles.createEmitter({
                    follow: this,
                    alpha: { start: 1, end: 0 },
                    scale: { start: 0.5, end: 0 },
                    speed: { min: 10, max: 60 },
                    lifespan: { min: 500, max: 1000 },
                    frequency: 100 - 20*corruption,
                    quantity: corruption,
                    active: true,
                });
                this.knifeSpeed = corruptKnifeSpeed;
                corruption = 0;
                usingCorruption = false;
                this.scene.corruptionDecayTimer.paused = false;
                if(player.corruptionExpiring) {
                    player.corruptionExpireTimer.destroy();
                }
                this.scene.sound.play('corruptionExpire');
            }
            this.knifeAngle = Phaser.Math.Angle.Between(player.x, player.y, this.targetX, this.targetY);

            this.setRotation(this.knifeAngle);
            this.scene.physics.moveTo(this, this.targetX, this.targetY, this.knifeSpeed);
        }

        if(this.shooting) {
            // If shot out of bounds remove everything
            if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
                this.shooting = false;
                if(this.corrupted) {
                    // this.scene.particleTrail.stop();
                    this.scene.time.delayedCall(particleDestroy, function () {
                        this.particleTrail.remove();
                        this.group.remove(this, true, true);
                    }, null, this);
                } else {
                    this.group.remove(this, true, true);
                }
                this.exists = false;
            }
        }
        // On first contact with enemy, play set timers to fade away and destroy this knife
        if(this.firstStuck) {
            this.firstStuck = false;
            if(this.exists) {
                this.scene.time.delayedCall(500, function () {
                    if(this.exists) { 
                        this.fadeAway.play();
                        this.scene.time.delayedCall(1000, function () {
                            this.exists = false;
                            this.fadeAway.remove();
                            this.group.remove(this, true, true);
                        }, null, this);
                    }
                }, null, this);
            }
        }
        // Update knife's position to stay stuck on enemy
        if(this.isStuck) {
            this.x = this.stuckEnemy.x + this.stuckOffsetX;
            this.y = this.stuckEnemy.y + this.stuckOffsetY;
        }
    }
}