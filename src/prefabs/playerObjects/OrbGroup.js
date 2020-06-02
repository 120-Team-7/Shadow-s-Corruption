class OrbGroup extends Phaser.GameObjects.Group {
    constructor(scene, hudScene, state, blueEnemyGroup) {
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

        // Orb x Enemy collider
        this.oxecollider = scene.physics.add.overlap(group, blueEnemyGroup, function(orb, enemy) {
            if(!enemy.orbDamageInvuln && enemy.exists) {
                // Shooting orb
                if(orb.shooting){
                    enemy.orbDamageInvuln = true;
                    if(orb.corrupted) {
                        game.scene.keys.hudScene.checkHealProgress(orb.damage);
                        pStats.orbCorruptedDamage += orb.damage;
                    }
                    enemy.takeDamage(orb.damage, orb.corrupted);
                    if(enemy.health <= 0) {
                        pStats.orbKilled++;
                    }
                    enemy.orbInvulnTimer = group.scene.time.delayedCall(orbShotInvulnDuration, function () {
                        enemy.orbDamageInvuln = false;
                    }, null, this.scene);
                    orb.scene.sound.play('orbHitmarker');
                // Idle orb blocking
                } else if (!enemy.orbBlockInvuln) {
                    enemy.orbBlockInvuln = true;
                    // Stun & knockback enemy on block
                    if(enemy.exists){
                        pStats.orbEnemyBlock++;
                        if(enemy.moving) {
                            enemy.moveTimer.paused = true;
                        }
                        enemy.body.stop();

                        increaseCorruption(blockCorruptionGain);
                        gainingCorruption = true;
                        if(player.canUseCorruption && gainingActive) {
                            // player.corruptionExpiring = false;
                            group.scene.gainingCorruptionTimer.destroy();
                        }
                        gainingActive = true;
                        group.scene.gainingCorruptionTimer = group.scene.time.delayedCall(gainingCorruptionDuration, function () {
                            gainingActive = false;
                            gainingCorruption = false;
                        }, null, this.scene);

                        // Calculate knockbackVector
                        this.enemyKnockbackVector = scaleVectorMagnitude(orbKnockbackVelocity, player.x, player.y, enemy.x, enemy.y); 
                        // Knockback enemy with calculated accel components
                        enemy.body.setVelocity(this.enemyKnockbackVector.x, this.enemyKnockbackVector.y);
                        this.sound.play('orbEnemyBlock');

                        // Allow enemy movement after short stun
                        if(enemy.stunned) {
                            enemy.stunTimer.destroy();
                        }
                        enemy.stunned = true;
                        enemy.stunTimer = group.scene.time.delayedCall(orbBlockStunDuration, function () {
                            if(enemy.moving) {
                                enemy.moveTimer.paused = false;
                            }
                            enemy.stunned = false;
                        }, null, this.scene);

                        // Allow ability to be blocked again after short invuln time
                        enemy.blockInvulnTimer = group.scene.time.delayedCall(orbBlockInvulnDuration, function () {
                            enemy.orbBlockInvuln = false;
                        }, null, this.scene);
                    }
                }
            }
        }, function() {
            if(group.state == blueEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        // Shoot a new orb
        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 1){
                if(!group.isOnCooldown){
                    pStats.orbShot++;
                    // On cooldown
                    group.isOnCooldown = true;
                    // Create and add new orb
                    // Orb(scene, group, oSpawnX, oSpawnY, targetX, targetY, state, shot) 
                    this.orb = new Orb(this.scene, this, idleWeaponX, idleWeaponY, 1, true);
                    this.add(this.orb);
                    // Pass variables to the orb for this shot
                    this.orb.shotX = this.orb.x;
                    this.orb.shotY = this.orb.y;
                    
                    // Target x Player distance to check if clicking too close to player 
                    // (prevent backwards shooting of orb)
                    this.playerX = player.x - this.scene.cameras.main.worldView.x;
                    this.playerY = player.y - this.scene.cameras.main.worldView.y;
                    this.pointerX = pointer.worldX- this.scene.cameras.main.worldView.x;
                    this.pointerY = pointer.worldY - this.scene.cameras.main.worldView.y;
                    this.oxtDist = Phaser.Math.Distance.Between(this.playerX, this.playerY, this.pointerX, this.pointerY);
                    if(this.pxtDist > minPXTDist) {
                        this.orb.targetX = pointer.worldX;
                        this.orb.targetY = pointer.worldY;
                    } else {
                        this.forwardShootVector = scaleVectorMagnitude(1, player.x, player.y, this.orb.x, this.orb.y);
                        this.orb.targetX = this.orb.x + this.forwardShootVector.x;
                        this.orb.targetY = this.orb.y + this.forwardShootVector.y;
                    }
                    this.orb.damage = orbShootDamage;
                    this.scene.sound.play('orbShoot');
                    // Start shot cooldown
                    group.orbCooldown = this.scene.time.delayedCall(orbShootROF, function () {
                        group.isOnCooldown = false;
                    }, null, this.scene);
                    // Change idle orb back to normal once corruption shot used
                    if(idleWeaponExists && usingCorruption) {
                        player.idleWeapon.setTexture('orb');
                    }
                }
            }
        }, this);
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
        // Adds idle weapon orb after switch
        if(playerState == 1 && !idleWeaponExists && !isGameOver) {
            // Orb(scene, group, oSpawnX, oSpawnY, targetX, targetY, state, shot)
            idleWeaponExists = true;
            player.idleWeapon = new Orb(this.scene, this, idleWeaponX, idleWeaponY, 1, false);
            this.add(player.idleWeapon);
            if(usingCorruption) {
                player.idleWeapon.setTexture('corruptOrb');
            }
        }

        // displayCooldown(cooldownText, cooldownBox, cooldownTimer, cooldownTime)
        if(this.isOnCooldown) {
            // this.hudScene.orbCooldownImage.setAlpha(0.5);
            displayCooldown(this.hudScene.orbCooldownText, this.hudScene.orbCooldownBox, this.orbCooldown, orbShootROF, this.hudScene.orbCDImage);
        } else {
            // this.hudScene.orbCooldownImage.setAlpha(1);
            this.hudScene.orbCooldownText.setText("");
            this.hudScene.orbCooldownBox.setSize(cooldownBoxWidth, cooldownBoxHeight);
        }
    }
}