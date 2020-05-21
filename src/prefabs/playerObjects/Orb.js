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
        this.shot;

        this.accel = orbAccel;
        this.accelMult = orbAccelMult;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        // this.body.setMaxVelocity(orbMaxSpeed, orbMaxSpeed);

        // this.body.setCircle(25, 50, 50);
        this.body.setCircle(50, 100, 100);

        // this.setAngularAcceleration(orbAngularAccel);
    }

    update(){    
        if(this.shot) {
            this.shooting = true;
            this.shot = false;
            if(usingCorruption) {
                this.setTexture('corruptOrb');
                this.damage += corruption;
                // this.accel = corruptOrbAccel;
                this.accelMult = corruptOrbAccelMult;
                corruption = 0;
                usingCorruption = false;
                this.scene.corruptionDecayTimer.paused = false;
                player.corruptionExpireTimer.destroy();
            }
        }
        if(this.shooting) {
            // Remove if goes off screen
            if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
                this.group.remove(this, true, true);
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