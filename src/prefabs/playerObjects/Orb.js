class Orb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state, shot) {
        super(scene, oSpawnX, oSpawnY, 'orb').setOrigin(0.5, 0.5);

        let orb = this;
        this.group = group;
        this.scene = scene;
        this.state = state;

        this.targetX;
        this.targetY;
        this.shotX;
        this.shotY;
        
        this.damage = orbShootDamage;
        this.shooting = false;
        this.shot = shot;
        this.corrupted = false;
        this.exists = true;

        this.accel = orbAccel;
        this.accelMult = orbAccelMult;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        // this.body.setMaxVelocity(orbMaxSpeed, orbMaxSpeed);

        // this.body.setCircle(25, 50, 50);
        this.body.setCircle(50, 100, 100);
        this.setDepth(999);

        this.emitCircle = new Phaser.Geom.Circle(this.x, this.y, 30);

        if(!this.shot) {
            this.fadeIn = this.scene.tweens.add({
                targets: this,
                alpha: { from: 0, to: 1 },
                scale: { from: 0, to: 1 },
                ease: 'Quart.easeIn',
                duration: 200,
            });
        }

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

    }

    update() {
        // Destroy any orb that is in an expected state: random floating idle
        if(!this.shot && !this.shooting && this != player.weaponMine && this != player.idleWeapon && !this.disapate.isPlaying()) {
            this.exists = false;
            this.destroy();
        }
        if(this.shot) {
            this.setAngularAcceleration(orbAngularAccel);
            this.shooting = true;
            this.shot = false;
            if(usingCorruption) {
                player.corruptContainerFade.play();
                // this.scene.corruptCircle.setActive(true);
                player.corruptCircleBloom.play();
                this.corrupted = true;
                this.particleTrail = corruptionParticles.createEmitter({
                    emitZone: { source: this.emitCircle },
                    alpha: { start: 1, end: 0 },
                    scale: { start: 0.75, end: 0 },
                    speed: { min: 10, max: 60 },
                    lifespan: { min: 1500, max: 2000 },
                    frequency: 100 - 20*corruption,
                    quantity: 1,
                    active: true,
                });
                this.setTexture('corruptOrb');
                this.damage += corruption;
                this.accelMult = corruptOrbAccelMult;
                this.setAngularAcceleration(corruptOrbAngularAccel);
                corruption = 0;
                usingCorruption = false;
                this.scene.corruptionDecayTimer.paused = false;
                if(player.corruptionExpiring) {
                    player.corruptionExpireTimer.destroy();
                }
                this.scene.cameras.main.shake(500, corruptionScreenShake);
                // this.scene.sound.play('corruptionExpire');
            }
            if(this.corrupted) {
                this.scene.sound.play('corruptedOrb');
            } else {
                this.scene.sound.play('orbShoot');
            }
        }
        if(this.shooting) {
            this.emitCircle.setPosition(this.x, this.y);
            // Remove if goes off screen
            if(this.x < this.scene.rooms[player.currentRoom].x || this.x > this.scene.rooms[player.currentRoom].width || this.y < this.scene.rooms[player.currentRoom].y || this.y > this.scene.rooms[player.currentRoom].height) {
                this.shooting = false;
                if(this.corrupted) {
                    this.particleTrail.stop();
                    this.scene.time.delayedCall(particleDestroy, function () {
                        this.particleTrail.remove();
                        this.group.remove(this, true, true);
                    }, null, this);
                } else {
                    this.group.remove(this, true, true);
                }
            } else {
                this.accelVector = scaleVectorMagnitude(this.accel, this.shotX, this.shotY, this.targetX, this.targetY)
                
                // Set new accel
                // this.body.acceleration.x = this.accelVector.x;
                // this.body.acceleration.y = this.accelVector.y;
                this.body.setAcceleration(this.accelVector.x, this.accelVector.y);

                // Increase accel
                this.accel = Math.round(this.accel * this.accelMult);
            }
        }
    }

    resetCooldown() {
        if(this.group.isOnCooldown) {
            this.group.orbCooldown.destroy();
            this.group.isOnCooldown = false;
        }
    }
}