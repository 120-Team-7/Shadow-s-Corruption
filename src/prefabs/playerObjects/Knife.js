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

        this.knifeSpeed = knifeSpeed;
        
        this.damage = knifeMeleeDamage;
        if(usingCorruption) {
            this.damage += corruption;
        }
        this.shooting = false;
        this.first = false;
        this.second = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(25);
    }

    update(){
        // Remove if goes off screen
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            this.group.remove(this, true, true);
        } else {
            // First firing direction (where player clicked)
            if(this.first == true){
                if(usingCorruption) {
                    this.knifeSpeed = corruptKnifeSpeed;
                    corruption = 0;
                    usingCorruption = false;
                    this.scene.corruptionDecayTimer.paused = false;
                    player.corruptionExpireTimer.destroy();
                }
                this.setRotation(Phaser.Math.Angle.Between(player.x, player.y, this.targetX, this.targetY));
                this.scene.physics.moveTo(this, this.targetX, this.targetY, this.knifeSpeed);
                this.first = false;
            }
        }
    }
}