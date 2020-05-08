class ChaserEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, oSpawnX, oSpawnY, state, health) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        }
        let enemy = this;
        this.group = group;
        this.scene = scene;
        this.state = state;
        this.state = true;     

        scene.add.existing(this);
        scene.physics.add.existing(this);

        scene.physics.moveToObject(this, player, chaserSpeed);
    }

    update(){

    }
}