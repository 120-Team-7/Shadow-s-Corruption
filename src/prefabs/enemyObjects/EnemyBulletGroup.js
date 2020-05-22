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
            if(!isInvuln && !inTutorial) {
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
                    if(player.idleWeapon.state == 1) {
                        this.scene.sound.play('orbBlock');
                    }
                    increaseCorruption(blockCorruptionGain);
                    gainingCorruption = true;
                    if(gainingActive) {
                        this.scene.gainingCorruptionTimer.destroy();
                    }
                    gainingActive = true;
                    this.scene.gainingCorruptionTimer = this.scene.time.delayedCall(gainingCorruptionDuration, function () {
                        gainingActive = false;
                        gainingCorruption = false;
                    }, null, this.scene);
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