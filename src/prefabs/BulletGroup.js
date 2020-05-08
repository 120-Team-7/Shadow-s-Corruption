class BulletGroup extends Phaser.GameObjects.Group {
    constructor(scene, redObjGroup, state) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
        }
        // Phaser.Physics.Arcade.Group(world, scene [, children] [, config])
        super(scene, null, groupConfig);

        let group = this;
        // let redGroup = redObjGroup;
        this.scene = scene;
        this.state = state;

        // https://phaser.discourse.group/t/remove-child-from-group-in-collider/4289
        this.collider = scene.physics.add.collider(group, redObjGroup, function(obj1, obj2) {
            obj1.destroy();
            obj2.takeDamage();
        }, function() {
            if(group.state == redObjGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 0){
                // Bullet(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
                this.add(new Bullet(this.scene, this, player.x, player.y, pointer.x, pointer.y, 0));
                // new Bullet(this.scene, this, player.x, player.y, pointer.x, pointer.y, 0)
            }
        }, this);

        
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
    }
}