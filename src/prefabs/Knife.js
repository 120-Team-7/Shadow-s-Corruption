class Knife extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state) {
        super(scene, oSpawnX, oSpawnY, 'knife');
        
        let knife = this;
        this.group = group;
        this.scene = scene;
        this.state = state;

        this.targetX;
        this.targetY;
        
        this.damage = knifeMeleeDamage;
        this.shooting = false;
        this.first = false;
        this.second = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(5).setOffset(this.width/2, this.height/2);
    }

    update(){
        // Remove if goes off screen
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            this.group.remove(this, true, true);
        } else {
            // First firing direction (where player clicked)
            if(this.first == true){
                if(usingCorruption) {
                    this.damage += corruption;
                    corruption = 0;
                    usingCorruption = false;
                    this.scene.corruptionDecayTimer.pause = false;
                    player.corruptionExpireTimer.destroy();
                }
                this.setRotation(Phaser.Math.Angle.Between(player.x, player.y, this.targetX, this.targetY));
                this.scene.physics.moveTo(this, this.targetX, this.targetY, knifeSpeed);
                this.first = false;
                this.second = true;
            }
            // Second firing direction (after knife reaches click position in radius)
            // If true, knife moves toward current pointer position
            // if(this.second == true && this.x >= this.targetX - knifeSecondRadius && this.x <= this.targetX + knifeSecondRadius &&
            //     this.y >= this.targetY - knifeSecondRadius && this.y <= this.targetY + knifeSecondRadius) {
            //     this.setRotation(Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y));
            //     this.scene.physics.moveTo(this, pointer.x, pointer.y, knifeSpeed);
            //     this.second = false;
            // }   
        }
    }
}