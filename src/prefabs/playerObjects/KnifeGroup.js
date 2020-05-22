class KnifeGroup extends Phaser.GameObjects.Group {
    constructor(scene, hudScene, state, redEnemyGroup) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
        }
        // Group(scene [, children] [, config])
        super(scene, null, groupConfig);

        let group = this;
        this.scene = scene;
        this.hudScene = hudScene;
        this.state = state;

        this.isOnCooldown = false;

        // Knife x Enemy collider
        this.kxeCollider = scene.physics.add.overlap(group, redEnemyGroup, function(knife, enemy) {

            // Stick knife to enemy
            knife.body.stop();
            knife.body.destroy();
            knife.firstStuck = true;
            knife.isStuck = true;
            knife.stuckOffsetX = 4.5*(knife.x - enemy.x) / 10;
            knife.stuckOffsetY = 4.5*(knife.y - enemy.y) / 10;
            knife.stuckEnemy = enemy;

            // Stop corruption trail if knife is corrupted
            if(knife.corrupted) {
                knife.particleTrail.stop();
                knife.scene.time.delayedCall(particleDestroy, function () {
                    knife.particleTrail.active = false;
                    knife.particleTrail.remove();
                }, null, knife);
            }

            // Corruption handling: increase corruption, check if gaining
            increaseCorruption(knife.damage);
            gainingCorruption = true;
            if(gainingActive) {
                // player.corruptionExpiring = false;
                group.scene.gainingCorruptionTimer.destroy();
            }
            gainingActive = true;
            group.scene.gainingCorruptionTimer = group.scene.time.delayedCall(gainingCorruptionDuration, function () {
                gainingActive = false;
                gainingCorruption = false;
            }, null, this.scene);

            enemy.takeDamage(enemy, knife.damage);
            // If it is a melee hit
            if(!group.isOnCooldown && !knife.shooting){
                idleWeaponExists = false;
                group.isOnCooldown = true;
                
                // Stun enemy on melee stab
                if(enemy.exists && enemy.moving){
                    enemy.moveTimer.paused = true;
                    enemy.body.stop();
                    if(enemy.stunned) {
                        enemy.stunTimer.destroy();
                    }
                    enemy.stunned = true;
                    // Allow enemy movement after short stun
                    enemy.stunTimer = group.scene.time.delayedCall(knifeMeleeStunDuration, function () {
                        enemy.moveTimer.paused = false;
                        enemy.stunned = false;
                    }, null, this.scene);
                }

                // If enemy killed set no cooldown, increase corruption to max, don't reset corruption
                if(enemy.health <= 0) {
                    increaseCorruption(maxCorruption);
                    group.isOnCooldown = false;
                // Start longer melee cooldown if didn't kill
                } else {
                    if(usingCorruption) {
                        corruption = 0;
                        usingCorruption = false;
                        enemy.scene.corruptionDecayTimer.paused = false;
                        player.corruptionExpireTimer.destroy();
                    }
                    group.knifeCooldown = group.scene.time.delayedCall(knifeMeleeROF, function () {
                        group.isOnCooldown = false;
                        // idleWeaponExists = false;
                        // Make sure both cooldowns are gone
                        group.knifeCooldown.destroy();
                    }, null, group.scene);
                }
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
                    this.knife.damage += knifeThrowDamage - knifeMeleeDamage;
                    // Triggers knife first throwing state
                    this.knife.shot = true;
                    this.knife.shooting = true;
                    knifeThrowSound.play();
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

        // displayCooldown(cooldownText, cooldownBox, cooldownTimer, cooldownTime)
        if(this.isOnCooldown) {
            displayCooldown(this.hudScene.knifeCooldownText, this.hudScene.knifeCooldownBox, this.knifeCooldown, this.knifeCooldown.delay);
        } else {
            // this.hudScene.knifeCooldownImage.setAlpha(1);
            this.hudScene.knifeCooldownText.setText("");
            this.hudScene.knifeCooldownBox.setSize(cooldownBoxWidth, cooldownBoxHeight);
        }
    }
}