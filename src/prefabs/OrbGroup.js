class OrbGroup extends Phaser.GameObjects.Group {
    constructor(scene, state, blueEnemyGroup) {
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

        // Orb x Enemy collider
        this.oxecollider = scene.physics.add.overlap(group, blueEnemyGroup, function(orb, enemy) {
            orb.destroy();
            enemy.takeDamage(enemy, orb.damage);
        }, function() {
            if(group.state == blueEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 1){
                if(!this.isOnCooldown){
                    this.isOnCooldown = true;
                    // Orb(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
                    this.add(new Orb(this.scene, this, player.idleWeapon.x, player.idleWeapon.y, pointer.x, pointer.y, 0));
                    this.scene.time.delayedCall(orbROF, function () {
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