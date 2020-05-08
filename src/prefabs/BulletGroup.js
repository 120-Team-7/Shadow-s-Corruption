class BulletGroup extends Phaser.GameObjects.Group {
    constructor(scene, redObjGroup, state) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
        }
        // Phaser.Physics.Arcade.Group(world, scene [, children] [, config])
        super(scene, null, groupConfig);

        let group = this;
        this.redObjGroup = redObjGroup;
        this.scene = scene;
        this.state = state;

        // https://phaser.discourse.group/t/remove-child-from-group-in-collider/4289
        this.collider = scene.physics.add.collider(group, this.redObjGroup, function(redObjGroup) {
            redObjGroup.destroy();
        }, function() {
            if(group.state == redObjGroup.state){
                console.log("hit");
                return true;
            } else {
                console.log("miss");
                return false;
            }
        }, scene)

        console.log(this.collider);

        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver){
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