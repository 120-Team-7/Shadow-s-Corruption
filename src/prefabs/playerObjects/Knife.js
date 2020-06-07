class Knife extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        if(usingCorruption){
            super(scene, oSpawnX, oSpawnY, 'corruptKnife').setOrigin(0.5, 0.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'knife').setOrigin(0.5, 0.5);
        }
        this.setAlpha(0);
        
        this.group = group;
        this.scene = scene;
        this.state = state;

        this.targetX;
        this.targetY;
        this.stuckEnemy;
        this.stuckOffsetX;
        this.stuckOffsetY;
        this.knifeSpeed = knifeSpeed;
        this.damage;
        this.corrupted;
        if(usingCorruption) {
            this.corrupted = true;
        } else {
            this.corrupted = false;
        }
        this.particlesActive = false;
        this.shooting = false;
        this.shot = false;
        this.firstStuck = false;
        this.isStuck = false;
        this.exists = true;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setAngle(player.weaponAngle);
        this.body.setCircle(25);
        this.setDepth(999);

        // Fade away knife after being stuck to enemy
        this.fadeAway = this.scene.tweens.add({
            targets: this,
            paused: true,
            alpha: { from: 1, to: 0 },
            ease: 'Quart.easeIn',
            duration: 1000,
            onComplete: function() {
                this.exists = false;
                this.group.remove(this, true, true);
            },
            onCompleteScope: this
        });
        // Quick reload "animation"
        this.fadeIn = this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            scale: { from: 0, to: 1 },
            ease: 'Quart.easeIn',
            duration: 200,
        });
        // For weapon mine
        this.disapate = this.scene.tweens.add({
            targets: this,
            paused: true,
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 0 },
            ease: 'Quart.easeIn',
            duration: 500,
            onComplete: function() {
                player.weaponMineExists = false;
                player.weaponMine = undefined;
                this.group.remove(this, true, true);
            },
            onCompleteScope: this
        });

        this.particleTrail = corruptionParticles.createEmitter({
            follow: this,
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: { min: 10, max: 60 },
            lifespan: { min: 1500, max: 2000 },
            frequency: 100 - 20*corruption,
            quantity: corruption,
            active: false,
        });
    }

    update() {
        // Destroy any knife that isn't in an expected state
        if(!this.shot && !this.shooting && this != player.weaponMine && this != player.idleWeapon && !this.disapate.isPlaying()) {
            this.exists = false;
            this.destroy();
        }
        // On first shot, apply corruption if using corruption, shoot toward given target
        if(this.shot && this.exists) {
            this.fadeIn.stop();
            this.setAlpha(1);
            this.setScale(1);
            this.shot = false;
            this.shooting = true;
            if(this.corrupted) {
                player.corruptContainerFade.play();
                player.corruptCircleBloom.play();
                this.particlesActive = true;
                this.particleTrail.active = true;
                this.damage = knifeThrowDamage + corruption;
                this.knifeSpeed = corruptKnifeSpeed;
                corruption = 0;
                usingCorruption = false;
                this.scene.corruptionDecayTimer.paused = false;
                if(player.corruptionExpiring) {
                    player.corruptionExpireTimer.destroy();
                }
                this.scene.cameras.main.shake(500, corruptionScreenShake);
            }
            this.knifeAngle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY);

            this.setRotation(this.knifeAngle);
            this.scene.physics.moveTo(this, this.targetX, this.targetY, this.knifeSpeed);
        }

        if(this.shooting) {
            // If shot out of bounds remove everything
            if(this.x < 0 || this.x > this.scene.map.widthInPixels || this.y < 0 || this.y > this.scene.map.heightInPixels) {
                this.shooting = false;
                if(this.corrupted) {
                    if(this.particlesActive) {
                        this.particleTrail.stop();
                    }
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

    resetCooldown() {
        if(this.group.isOnCooldown) {
            this.group.knifeCooldown.destroy();
            this.group.isOnCooldown = false;
        }
    }
}

