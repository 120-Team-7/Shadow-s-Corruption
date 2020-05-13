class Knife extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
        super(scene, oSpawnX, oSpawnY, 'knife').setOrigin(0.5, 0.5);
        
        let knife = this;
        this.group = group;
        this.targetX = targetX;
        this.targetY = targetY;
        this.scene = scene;
        this.state = state;
        
        this.active = true;
        this.damage = knifeDamage;
        this.first = true;
        this.second = false;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(5);

        
        this.setRotation(Phaser.Math.Angle.Between(oSpawnX, oSpawnY, targetX, targetY));
    }

    update(){
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            this.group.remove(this, true, true);
        }

        // First firing direction (where player clicked)
        if(this.first == true){
            this.scene.physics.moveTo(this, this.targetX, this.targetY, knifeSpeed);
            this.first = false;
            this.second = true;
        }
        // Second firing direction (after knife reaches click position in radius)
        // If true, knife moves toward current pointer position
        if(this.second == true && this.x >= this.targetX - knifeSecondRadius && this.x <= this.targetX + knifeSecondRadius &&
            this.y >= this.targetY - knifeSecondRadius && this.y <= this.targetY + knifeSecondRadius) {
            this.setRotation(Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y));
            this.scene.physics.moveTo(this, pointer.x, pointer.y, knifeSpeed);
            this.second = false;
        }
    }
}