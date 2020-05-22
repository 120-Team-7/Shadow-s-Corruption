class Orb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        // super(scene, oSpawnX, oSpawnY, 'orb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
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
        this.shot = false;
        this.corrupted = false;

        this.accel = orbAccel;
        this.accelMult = orbAccelMult;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        // this.body.setMaxVelocity(orbMaxSpeed, orbMaxSpeed);

        // this.body.setCircle(25, 50, 50);
        this.body.setCircle(50, 100, 100);
        this.setDepth(999);

        this.emitCircle = new Phaser.Geom.Circle(this.x, this.y, 30);

        
    }

    update(){    
        if(this.shot) {
            this.setAngularAcceleration(orbAngularAccel);
            this.shooting = true;
            this.shot = false;
            if(usingCorruption) {
                this.corrupted = true;
                this.particleTrail = corruptionParticles.createEmitter({
                    emitZone: { source: this.emitCircle },
                    alpha: { start: 1, end: 0 },
                    scale: { start: 0.5, end: 0 },
                    speed: { min: 10, max: 60 },
                    lifespan: { min: 500, max: 1000 },
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
            }
        }
        if(this.shooting) {
            this.emitCircle.setPosition(this.x, this.y);

            // Remove if goes off screen
            if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
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
}