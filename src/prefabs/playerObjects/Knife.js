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
        this.shot = false;
        this.corrupted = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(25);
        this.setDepth(999);

        
    }

    update(){
        if(this.shot){
            if(usingCorruption) {
                this.corrupted = true;
                this.particleTrail = corruptionParticles.createEmitter({
                    follow: this,
                    alpha: { start: 1, end: 0},
                    scale: { start: 0.5, end: 0},
                    speed: {min: 10, max: 60},
                    lifespan: { min: 500, max: 1000},
                    frequency: 100 - 20*corruption,
                    quantity: corruption,
                    active: false,
                });
                this.particleTrail.active = true;
                this.knifeSpeed = corruptKnifeSpeed;
                corruption = 0;
                usingCorruption = false;
                this.scene.corruptionDecayTimer.paused = false;
                player.corruptionExpireTimer.destroy();
            }
            this.knifeAngle = Phaser.Math.Angle.Between(player.x, player.y, this.targetX, this.targetY);

            this.setRotation(this.knifeAngle);
            this.scene.physics.moveTo(this, this.targetX, this.targetY, this.knifeSpeed);
            this.shot = false;
        }

        if(this.shooting) {
            if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
                this.shooting = false;
                if(this.corrupted) {
                    // this.scene.particleTrail.stop();
                    this.scene.time.delayedCall(particleDestroy, function () {
                        this.particleTrail.remove();
                        this.group.remove(this, true, true);
                    }, null, this);
                } else {
                    this.group.remove(this, true, true);
                }
            }
        }
    }
}