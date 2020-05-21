class EnemyBulletGroup extends Phaser.GameObjects.Group {
    constructor(scene, state) {
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

        // Bullet x Player collider
        this.bxpCollider = scene.physics.add.overlap(group, player, function(bullet) {
            bullet.destroy();
            if(!isInvuln) {
                player.playerHit(bullet.damage);
            }
        }, function() {
            if(group.state == playerState) {
                return true;
            } else {
                return false;
            }
        }, scene)
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();

        // Check collision between bullets and idle weapon, if overlap with same color, destory bullet
        if(idleWeaponExists) {
            this.scene.physics.overlap(this, player.idleWeapon, 
                (bullet) => {
                    bullet.destroy();
                    increaseCorruption(blockCorruptionGain);
                }, 
                () => {
                    if(this.state == player.idleWeapon.state) {
                        return true;
                    } else {
                        return false;
                    }
                }, 
                this.scene
            );
        }
        
    }

    addBullet(state, spawnX, spawnY, targetX, targetY) {
        // EnemyBullet(scene, group, spawnX, spawnY, state, targetX, targetY)
        this.add(new EnemyBullet(this.scene, this, spawnX, spawnY, state, targetX, targetY));
    }
}