class KnifeGroup extends Phaser.GameObjects.Group {
    constructor(scene, state, redEnemyGroup) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
        }
        // Group(scene [, children] [, config])
        super(scene, null, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        this.isOnCooldown = false;

        // Knife x Enemy collider
        this.kxeCollider = scene.physics.add.overlap(group, redEnemyGroup, function(knife, enemy) {
            knife.destroy();
            enemy.takeDamage(enemy, knife.damage);
        }, function() {
            if(group.state == redEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 0){
                if(!this.isOnCooldown){
                    this.isOnCooldown = true;
                    // Knife(scene, group, oSpawnX, oSpawnY, targetX, targetY, state)
                    this.add(new Knife(this.scene, this, player.idleWeapon.x, player.idleWeapon.y, pointer.x, pointer.y, 0));
                    this.scene.time.delayedCall(knifeROF, function () {
                        group.isOnCooldown = false;
                    }, null, this.scene);
                }
            }
        }, this);

        
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
    }
}