class BulletGroup extends Phaser.GameObjects.Group {
    constructor(scene, state, redObjGroup, redEnemyGroup) {
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
        // Bullet x Obstacle collider
        this.bxoCollider = scene.physics.add.collider(group, redObjGroup, function(bullet, obstacle) {
            bullet.destroy();
            obstacle.takeDamage(bullet.damage);
        }, function() {
            if(group.state == redObjGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        // Bullet x Enemy collider
        this.bxecollider = scene.physics.add.collider(group, redEnemyGroup, function(bullet, enemy) {
            bullet.destroy();
            enemy.takeDamage(bullet.damage);
        }, function() {
            if(group.state == redEnemyGroup.state){
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