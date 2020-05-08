class BulletGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, redObjGroup, state) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
        }
        // Phaser.Physics.Arcade.Group(world, scene [, children] [, config])
        super(scene.physics.world, scene, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        // this.collider = scene.physics.add.collider(this, redObjGroup, null, function() {
        //     if(group.state == redObjGroup.state){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }, scene)
    }

    update() {
        // Somehow needed to update children
        // this.update();
    }

    addBullet(spawnX, spawnY, pointerX, pointerY){
        // Bullet(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
        this.add(new Bullet(this.scene, this, spawnX, spawnY, pointerX, pointerY, 0), true);
    }
}