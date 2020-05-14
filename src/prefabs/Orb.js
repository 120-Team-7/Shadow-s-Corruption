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
        
        this.damage = 1;
        this.shooting = false;
        this.shot = false;

        this.accel = orbAccel;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setMaxVelocity(orbMaxSpeed, orbMaxSpeed);

        this.body.setCircle(50);
    }

    update(){
        // Remove if goes off screen
        if(this.shot){
            if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
                this.group.remove(this, true, true);
            } else {
                // Calculate variables
                this.xDist = this.targetX - this.shotX;
                this.yDist = this.targetY - this.shotY;

                // Converts the xDist, yDist components into target components in order to covert to orbAccel vector on combining components
                // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is orbAccel and a, b are xDist, yDist
                this.scaleFactor = Math.sqrt(Math.pow(Math.abs(this.xDist), 2) + Math.pow(Math.abs(this.yDist), 2)) / this.accel;

                // Changes components to proper magnitudes
                this.accelX = this.xDist / this.scaleFactor;       
                this.accelY = this.yDist / this.scaleFactor;

                // Set new accel
                this.body.acceleration.x = this.accelX;
                this.body.acceleration.y = this.accelY;

                // Increase accel
                this.accel = this.accel * orbAccelMult;
            }
        }
    }
}