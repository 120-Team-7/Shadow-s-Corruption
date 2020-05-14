class Orb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        super(scene, oSpawnX, oSpawnY, 'orb');
        
        let knife = this;
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

        this.accel = orbAccel;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setMaxVelocity(orbMaxSpeed, orbMaxSpeed);

        this.body.setCircle(50);
    }

    update(){
        
        if(this.shot){
            if(usingCorruption) {
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