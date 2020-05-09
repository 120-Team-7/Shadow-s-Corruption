class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
        super(scene, oSpawnX, oSpawnY, 'bullet').setOrigin(0.5, 0.5);
        
        let bullet = this;
        this.group = group;
        this.scene = scene;
        this.state = state;
        this.active = true;

        this.damage = bulletDamage;
            
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(10);

        scene.physics.moveTo(this, targetX, targetY, bulletSpeed);
        this.setRotation(Phaser.Math.Angle.Between(oSpawnX, oSpawnY, targetX, targetY));
    }

    update(){
        if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
            this.group.remove(this, true, true);
        }
    }
}