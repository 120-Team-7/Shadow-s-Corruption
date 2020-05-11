class WaveGroup extends Phaser.GameObjects.Group {
    constructor(scene, state, blueObjGroup, blueEnemyGroup) {
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

        // Wave x Obstacle collider
        this.wxoCollider = scene.physics.add.collider(group, blueObjGroup, function(wave, obstacle) {
            wave.destroy();
            obstacle.takeDamage(wave.damage);
        }, function() {
            if(group.state == blueObjGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        // Wave x Enemy collider
        this.wxecollider = scene.physics.add.overlap(group, blueEnemyGroup, function(wave, enemy) {
            wave.destroy();
            enemy.takeDamage(enemy, wave.damage);
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
                    // Wave(scene, group, oSpawnX, oSpawnY, targetX, targetY, state) {
                    this.add(new Wave(this.scene, this, player.x, player.y, pointer.x, pointer.y, 0));
                    this.scene.time.delayedCall(waveROF, function () {
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