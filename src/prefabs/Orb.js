class Orb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        if(usingCorruption) {
            super(scene, oSpawnX, oSpawnY, 'corruptOrb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
        } else {
            super(scene, oSpawnX, oSpawnY, 'orb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
        }

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

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setMaxVelocity(orbMaxSpeed, orbMaxSpeed);

        this.body.setCircle(25, 50, 50);
    }

    update(){    
        if(this.shot){
            if(usingCorruption) {
                this.setTexture('corruptOrb');
                if(idleWeaponExists && player.idleWeapon.state == 1) {
                    player.idleWeapon.setTexture('orb');
                }
                this.damage += corruption;
                corruption = 0;
                usingCorruption = false;
                this.scene.corruptionDecayTimer.paused = false;
                player.corruptionExpireTimer.destroy();
            }
            // Remove if goes off screen
            if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
                this.group.remove(this, true, true);
            } else {
                this.accelVector = scaleVectorMagnitude(this.accel, this.shotX, this.shotY, this.targetX, this.targetY)

                // Set new accel
                this.body.acceleration.x = this.accelVector.x;
                this.body.acceleration.y = this.accelVector.y;

                // Increase accel
                this.accel = this.accel * orbAccelMult;
            }
        }
    }
}