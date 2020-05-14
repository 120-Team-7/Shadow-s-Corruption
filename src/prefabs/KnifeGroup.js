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
            increaseCorruption(knife.damage);
            if(usingCorruption) {
                knife.damage += corruption;
                corruption = 0;
                usingCorruption = false;
                enemy.scene.corruptionDecayTimer.paused = false;
                player.corruptionExpireTimer.destroy();
            }
            enemy.takeDamage(enemy, knife.damage);
            // console.log("knife damage: " + knife.damage);
            // If it is a melee hit
            if(!group.isOnCooldown && !knife.shooting){
                group.isOnCooldown = true;
                // Start melee cooldown
                group.knifeCooldown = group.scene.time.delayedCall(knifeMeleeROF, function () {
                    group.isOnCooldown = false;
                    idleWeaponExists = false;
                    // Make sure both cooldowns are gone
                    group.knifeCooldown.destroy();
                }, null, group.scene);
            }
        }, function() {
            if(group.state == redEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        

        // Throw the knife
        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 0){
                if(!this.isOnCooldown){
                    // On cooldown
                    this.isOnCooldown = true;
                    // Stop updating idleWeapon, store the current idleWeapon, remove its reference
                    idleWeaponExists = false;
                    this.knife = player.idleWeapon;
                    player.idleWeapon = null;
                    // Update knife variables
                    this.knife.shooting = true;
                    this.knife.targetX = pointer.x;
                    this.knife.targetY = pointer.y;
                    this.knife.damage = knifeThrowDamage;
                    // Triggers knife first throwing state
                    this.knife.first = true;
                    // Start throw cooldown
                    group.knifeCooldown = this.scene.time.delayedCall(knifeThrowROF, function () {
                        group.isOnCooldown = false;
                        // Make sure both cooldowns are gone
                        group.knifeCooldown.destroy();
                    }, null, this.scene);
                }
            }
        }, this);
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();

        // Destroy cooldowns upon switching
        if(playerState == 1 && switchOnCooldown && this.isOnCooldown) {
            this.knifeCooldown.destroy();
            this.isOnCooldown = false;
        }

        // Adds idle weapon knife when cooldowns are over
        if(playerState == 0 && !this.isOnCooldown && !idleWeaponExists && !isGameOver) {
            idleWeaponExists = true;
            // Knife(scene, group, oSpawnX, oSpawnY, targetX, targetY, state)
            player.idleWeapon = new Knife(this.scene, this, idleWeaponX, idleWeaponY, 0);
            this.add(player.idleWeapon);
        }
    }
}